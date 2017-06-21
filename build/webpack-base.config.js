const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, 'src');
const DESTINATION = path.resolve(ROOT, 'dist');

const BUNDLES = DESTINATION + '/bundles';
const LIB_NAME = 'streamdataio';

module.exports = function (target, entities)
{
  let entries = {};
  entries[`${LIB_NAME}-${target}`] = entities;
  entries[`${LIB_NAME}-${target}.min`] = entities;

  return {
    context: SRC,
    target : target,
    entry  : entries,

    output : {
      filename      : "[name].js",
      path          : BUNDLES,
      library       : LIB_NAME,
      libraryTarget : 'umd',
      umdNamedDefine: true
    }
    ,
    resolve: {
      extensions: ['.ts', '.js'],
      modules   : [
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
      }),
      new webpack.optimize.UglifyJsPlugin({
        dead_code : true,
        minimize : true,
        sourceMap: true,
        include  : /\.min\.js$/,
      })
    ],
    module : {
      rules: [
        /****************
         * PRE-LOADERS
         *****************/
        {
          enforce: 'pre',
          test   : /\.js$/,
          use    : 'source-map-loader'
        },
        {
          enforce: 'pre',
          test   : /\.ts$/,
          exclude: /node_modules/,
          use    : 'tslint-loader'
        },
        /****************
         * LOADERS
         *****************/
        {
          test   : /\.ts$/,
          exclude: /node_modules/,
          use    : 'awesome-typescript-loader'
        }
      ]
    }
  }
}
;

