const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

function findHashFromFileName(startPath, filter, onHashesFound){
  if (!fs.existsSync(startPath)){
    console.log(chalk.red(`no dir ${startPath}`));
    return;
  }

  const files = fs.readdirSync(startPath);
  let hashes = [];
  for (let i=0; i<files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (filter.test(filename)) {
      const hash = filename.match(filter)[1];
      hashes.push(hash);
    }
  }

  if (hashes.length !== 1) {
    console.log(chalk.red(`ERROR: expected exactly 1 hash for ${filter} but got ${hashes.length}`));
    console.log(chalk.red(`BUILD IS WRONG. DO NOT DEPLOY`));
  }
  onHashesFound(hashes[0])
};

function getOutputHashes(onGotHashes) {
  const directory = 'build/js';
  let appHash = '';
  let chunkHash = '';
  findHashFromFileName(directory, /build\/js\/app\.(.*)\.js$/, function(hashapp) {
    appHash = hashapp;
    findHashFromFileName(directory, /build\/js\/(.*)\.chunk\.js$/, function(hashchunk) {
      chunkHash = hashchunk;
      onGotHashes(appHash, chunkHash);
    });
  });
};

function runInitialBuildCommand(callback) {
  const command = ``+
    `cross-env NODE_ENV=production ENV=${process.env.ENV} `+
    `webpack --config webpack/webpack.config.prod.js --colors`;
  console.log(chalk.cyan('Running initial build command'))
  shell.exec(command, function(error, stdout, stderr) {
    getOutputHashes(callback)
  });
}

function rebuildWithUpdatedWidgetJs(appHash, chunkHash) {
  console.log(chalk.cyan(`Re-running 'build', with 'appHash' and 'chunkHash' env vars (for widget.js consumption).`));
  console.log(chalk.cyan(`appHash: ${appHash}; chunkHash: ${chunkHash}`));
  const command = ``+
    `cross-env NODE_ENV=production ENV=${process.env.ENV} `+
    `APP_HASH=${appHash} CHUNK_HASH=${chunkHash} `+
    `webpack --config webpack/webpack.config.prod.js --colors`;
  shell.exec(command, function(error, stdout, stderr) {
    console.log(chalk.cyan(`Second 'build' command ran. Double checking app and chunk hashes didn't change.`))
    getOutputHashes((hashapp, hashchunk) => {
      if (hashapp === appHash && hashchunk === chunkHash) {
        const deployCommand = chalk.green.bold.underline(`yarn deploy-${process.env.ENV}`)
        console.log(chalk.green(`${process.env.ENV} succesfully built. Ready for deploy with ${deployCommand}`));
      }
    });
  });
}

runInitialBuildCommand(rebuildWithUpdatedWidgetJs);
