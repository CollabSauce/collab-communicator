const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const SentryCli = require('@sentry/cli');

const RELEASE = shell.exec('git rev-parse --short HEAD').replace(/(\r\n|\n|\r)/gm, ''); // Strip away the \n of the `release`.

function findHashFromFileName(startPath, filter){
  if (!fs.existsSync(startPath)){
    console.log(chalk.red(`no dir ${startPath}`));
    return;
  }

  const files = fs.readdirSync(startPath);
  let hashes = [];
  for (let i=0; i<files.length; i++) {
    const filename = path.join(startPath, files[i]);
    if (filter.test(filename)) {
      const hash = filename.match(filter)[1];
      hashes.push(hash);
    }
  }

  if (hashes.length !== 1) {
    console.log(chalk.red(`ERROR: expected exactly 1 hash for ${filter} but got ${hashes.length}`));
    console.log(chalk.red(`BUILD IS WRONG. DO NOT DEPLOY`));
  }

  return hashes[0];
};

function removeSourceMapsForDirectory(startPath, filter, expectedMatches) {
  if (!fs.existsSync(startPath)) {
    console.log(chalk.red(`no dir ${startPath}`));
    return;
  }

  const files = fs.readdirSync(startPath);
  let matchedFilenames = [];
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    if (filter.test(filename)) {
      matchedFilenames.push(filename);
    }
  }

  if (matchedFilenames.length !== expectedMatches) {
    console.log(
      chalk.red(`ERROR: expected exactly ${expectedMatches} filenames for ${filter} but got ${matchedFilenames.length}`)
    );
    console.log(chalk.red(`BUILD IS WRONG. DO NOT DEPLOY`));
  }

  // Remove all the `.map` the sourcemaps file so it's not accessible in the browser
  for (let i = 0; i < matchedFilenames.length; i++) {
    shell.rm(matchedFilenames[i]);
  }
}

function getOutputHashes() {
  const directory = 'build/js';
  const fileHashFilters = [
    /build\/js\/app\.(.*)\.js$/,
    /build\/js\/(.*)\.chunk\.js$/
  ];

  const foundHashes = []
  for (let i = 0; i < fileHashFilters.length; i++) {
    const hash = findHashFromFileName(directory, fileHashFilters[i]);
    foundHashes.push(hash);
  }

  return foundHashes;
};

function runInitialBuildCommand() {
  if (!RELEASE) {
    console.log(chalk.red('could not get release'));
    return;
  }
  const command = ``+
    `cross-env NODE_ENV=production ENV=${process.env.ENV} SENTRY_RELEASE=${RELEASE} `+
    `webpack --config webpack/webpack.config.prod.js --colors`;
  console.log(chalk.cyan('Running initial build command'))
  console.log(chalk.cyan(command))

  shell.exec(command);

  const [appHash, chunkHash] = getOutputHashes();
  rebuildWithUpdatedWidgetJs(appHash, chunkHash);
}

function rebuildWithUpdatedWidgetJs(appHash, chunkHash) {
  console.log(chalk.cyan(`Re-running 'build', with 'appHash' and 'chunkHash' env vars (for widget.js consumption).`));
  console.log(chalk.cyan(`appHash: ${appHash}; chunkHash: ${chunkHash}`));
  const command = ``+
    `cross-env NODE_ENV=production ENV=${process.env.ENV} SENTRY_RELEASE=${RELEASE} `+
    `APP_HASH=${appHash} CHUNK_HASH=${chunkHash} `+
    `webpack --config webpack/webpack.config.prod.js --colors`;
  console.log(chalk.cyan(command))

  shell.exec(command);

  console.log(chalk.cyan(`Second 'build' command ran. Double checking app and chunk hashes didn't change.`))
  const [appHash2, chunkHash2] = getOutputHashes();
  if (appHash === appHash2 && chunkHash === chunkHash2) {
    const deployCommand = chalk.green.bold.underline(`yarn deploy-${process.env.ENV}`)
    console.log(chalk.green(`widget.js succesfully built with appHash and chunkHash.`));
    if (process.env.ENV !== 'development') {
      console.log(chalk.green(`Uploading to sentry.`));
      uploadBuildToSentry();
    }
  } else {
    console.log(chalk.red('appHash or chunkHash did not match after rebuild. DO NOT DEPLOY'));
  }
}

async function uploadBuildToSentry() {
  const cli = new SentryCli();
  try {
    console.log(chalk.cyan('Creating sentry release ' + RELEASE));

    await cli.releases.new(RELEASE);
    console.log(chalk.cyan('Uploading source maps'));
    await cli.releases.uploadSourceMaps(RELEASE, {
      include: ['build/js'],
      urlPrefix: '~/js',
      rewrite: false,
    });
    console.log(chalk.green('Finalizing release'));
    await cli.releases.finalize(RELEASE);
  } catch (e) {
    console.error(chalk.red('Source maps uploading failed:', e));
  }
  removeSourceMaps();
}

function removeSourceMaps() {
  console.log(chalk.cyan('removing sourcemaps'));
  const jsDirectory = 'build/js';
  const jsMapFilesRegex = /build\/js\/.*\.js.map$/;

  removeSourceMapsForDirectory(jsDirectory, jsMapFilesRegex, 3);

  const deployCommand = chalk.green.bold.underline(`yarn deploy-${process.env.ENV}`);
  console.log(chalk.green(`${process.env.ENV} succesfully built. Ready for deploy with ${deployCommand}`));
}

runInitialBuildCommand();
