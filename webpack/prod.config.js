const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ReplacePlugin = require('replace-webpack-plugin');

const publicPath = 's.xiaolumeimei.com/mall/';

module.exports = {

  entry: ['bootstrap-loader/extractStyles'],

  output: {
    publicPath: publicPath,
    filename: 'app-[hash].js',
  },

  module: {
    loaders: [{
      test: /\.scss$/,
      loader: 'style!css!postcss-loader!sass',
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
      __DEVELOPMENT__: false,
    }),
    new ExtractTextPlugin('app-[hash].css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ReplacePlugin({
      skip: process.env.NODE_ENV === 'development',
      entry: 'index.html',
      hash: '[hash]',
      output: 'dist/index.html',
      data: {
        css: '<link type="text/css" rel="stylesheet" href="' + publicPath + 'app-[hash].css">',
        js: '<script src="' + publicPath + 'app-[hash].js"></script><script type="text/javascript">window.bughd = window.bughd || function() {}; window.bughd(\'create\',{key: \'84f20f4fcf7cc0c71462e63cfa8cd1b5\',});</script>',
      },
    }),
    new webpack.ProvidePlugin({
      Promise: 'exports?global.Promise!es6-promise',
      pingpp: 'src/vendor/pingpp',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};
