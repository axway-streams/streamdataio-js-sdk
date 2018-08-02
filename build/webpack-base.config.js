const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, 'src');
const DESTINATION = path.resolve(ROOT, 'dist');

const BUNDLES = DESTINATION + '/bundles';
const LIB_NAME = 'streamdataio';

module.exports = function (target, entities, addSuffix) {
  let entries = {};
  let entry = LIB_NAME;
  if (addSuffix) {
    entry += `-${target}`;
  }
  entries[entry] = entities;
  entries[`${entry}.min`] = entities;

  return {
    context: SRC,
    target: target,
    entry: entries,
    mode: 'production',
    output: {
      filename: "[name].js",
      path: BUNDLES,
      library: LIB_NAME,
      libraryTarget: 'umd',
      umdNamedDefine: true
    }
    ,
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [
        SRC,
        'node_modules',
        'typings'
      ]
    }
    ,
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        NODE: JSON.stringify(target === 'node')
      })
    ],
    optimization: {
      minimize: false
    },
    module: {
      rules: [
        /****************
         * PRE-LOADERS
         *****************/
        {
          enforce: 'pre',
          test: /\.js$/,
          use: 'source-map-loader'
        },
        {
          enforce: 'pre',
          test: /\.ts$/,
          exclude: /node_modules/,
          use: 'tslint-loader'
        },
        /****************
         * LOADERS
         *****************/
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: 'awesome-typescript-loader'
        }
      ]
    }
  }
}
;

