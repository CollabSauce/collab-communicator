const exec = require('child_process').exec;
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

  onHashesFound(hashes)
};

function getOutputHashes(onGotHashes) {
  const directory = 'build/js';
  let appHash = '';
  let chunkHashes = '';
  findHashFromFileName(directory, /build\/js\/app\.(.*)\.js$/, function(hashesapp) {
    if (hashesapp.length !== 1) {
      console.log(chalk.red(`ERROR: expected exactly 1 app-hash but got ${hashesapp.length}`));
      return;
    }
    appHash = hashesapp[0];
    findHashFromFileName(directory, /build\/js\/(.*)\.chunk\.js$/, function(hasheschunk) {
      if (hasheschunk.length !== 2) {
        console.log(chalk.red(`ERROR: expected exactly 2 chunk-hashes but got ${hasheschunk.length}`));
      }
      chunkHashes = hasheschunk;
      onGotHashes(appHash, chunkHashes);
    });
  });
};

function runInitialBuildCommand(callback) {
  const command = ``+
    `cross-env NODE_ENV=production ENV=${process.env.ENV} `+
    `webpack --config webpack/webpack.config.prod.js --colors`;
  console.log(chalk.cyan('Running initial build command'))
  exec(command, function(error, stdout, stderr) {
    getOutputHashes(callback)
  });
}

function rebuildWithUpdatedWidgetJs(appHash, chunkHashes) {
  console.log(chalk.cyan(`Re-running 'build', with 'appHash' and 'chunkHashes' env vars (for widget.js consumption).`));
  console.log(chalk.cyan(`appHash: ${appHash}; chunkHashes: ${JSON.stringify(chunkHashes)}`));
  const command = ``+
    `cross-env NODE_ENV=production ENV=${process.env.ENV} `+
    `APP_HASH=${appHash} CHUNK_HASHES=${chunkHashes} `+
    `webpack --config webpack/webpack.config.prod.js --colors`;
  exec(command, function(error, stdout, stderr) {
    console.log(chalk.cyan(`Second 'build' command ran. Double checking app and chunk hashes didn't change.`))
    getOutputHashes((hashapp, hasheschunk) => {
      if (hashapp === appHash && hasheschunk[0] === chunkHashes[0] && hasheschunk[1] === chunkHashes[1]) {
        const deployCommand = chalk.green.bold.underline(`yarn deploy-${process.env.ENV}`)
        console.log(chalk.green(`${process.env.ENV} succesfully built. Ready for deploy with ${deployCommand}`));
      }
    });
  });
}

runInitialBuildCommand(rebuildWithUpdatedWidgetJs);
