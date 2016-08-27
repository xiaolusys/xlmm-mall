const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ReplacePlugin = require('replace-webpack-plugin');

const publicPath = '/mall/';

const extractCSS = new ExtractTextPlugin('app-[hash].css');
const frameworkVersion = '1.0.0';

module.exports = {

  entry: ['bootstrap-loader/extractStyles'],

  output: {
    publicPath: publicPath,
    filename: 'app-[hash].js',
  },

  module: {
    loaders: [{
      test: /\.scss$/,
      loader: extractCSS.extract(['css', 'sass']),
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
      __DEVELOPMENT__: false,
    }),
    extractCSS,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: `framework-${frameworkVersion}.js`,
      minChunks: Infinity,
    }),
    new ReplacePlugin({
      skip: process.env.NODE_ENV === 'development',
      entry: 'index.html',
      hash: '[hash]',
      output: 'dist/index.html',
      data: {
        css: '<link type="text/css" rel="stylesheet" href="' + publicPath + 'app-[hash].css">',
        framework: `<script src="${publicPath}framework-${frameworkVersion}.js"></script>`,
        app: `<script src="${publicPath}app-[hash].js"></script>`,
        bughd: '<script type="text/javascript" src="https://dn-bughd-web.qbox.me/bughd.min.js" crossOrigin="anonymous"></script><script type="text/javascript">window.bughd = window.bughd || function() {}; window.bughd(\'create\',{key: \'84f20f4fcf7cc0c71462e63cfa8cd1b5\',});</script>',
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
