const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

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
  const command = ``+
    `cross-env NODE_ENV=production ENV=${process.env.ENV} `+
    `webpack --config webpack/webpack.config.prod.js --colors`;
  console.log(chalk.cyan('Running initial build command'))

  shell.exec(command);

  const [appHash, chunkHash] = getOutputHashes();
  rebuildWithUpdatedWidgetJs(appHash, chunkHash);
}

function rebuildWithUpdatedWidgetJs(appHash, chunkHash) {
  console.log(chalk.cyan(`Re-running 'build', with 'appHash' and 'chunkHash' env vars (for widget.js consumption).`));
  console.log(chalk.cyan(`appHash: ${appHash}; chunkHash: ${chunkHash}`));
  const command = ``+
    `cross-env NODE_ENV=production ENV=${process.env.ENV} `+
    `APP_HASH=${appHash} CHUNK_HASH=${chunkHash} `+
    `webpack --config webpack/webpack.config.prod.js --colors`;

  shell.exec(command);

  console.log(chalk.cyan(`Second 'build' command ran. Double checking app and chunk hashes didn't change.`))
  const [appHash2, chunkHash2] = getOutputHashes();
  if (appHash === appHash2 && chunkHash === chunkHash2) {
    const deployCommand = chalk.green.bold.underline(`yarn deploy-${process.env.ENV}`)
    console.log(chalk.green(`${process.env.ENV} succesfully built. Ready for deploy with ${deployCommand}`));
  }
}

runInitialBuildCommand();
