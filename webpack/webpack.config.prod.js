const Webpack = require('webpack');
const Path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  entry: {
    app: Path.resolve(__dirname, '../src/scripts/index.js'),
    widget: Path.resolve(__dirname, '../src/scripts/widget.js'),
  },
  output: {
    filename: (pathData, assetInfo) => {
      // add a unique hash to app.js (or any other file we are outputting).
      // Dont ever add a hash to widget.js, as that is the url for the script tag.
      return pathData.chunk.name === 'widget' ? 'js/[name].js' : 'js/[name].[chunkhash:8].js';
    },
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s?css/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
});
