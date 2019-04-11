const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const webpackMerge = require('webpack-merge');
const configs = require('./config.js');
const common = require('./webpack.common.js');

const base = {
  entry: [
    '@babel/polyfill',
    'expose-loader?$!expose-loader?jQuery!jquery',
    'script-loader!foundation-sites',
    path.join(__dirname, '../src/index.jsx'),
  ],
  output: {
    path: path.join(__dirname, '..', 'cordova', 'www'),
    filename: 'bundle.js',
  },
  plugins: [
    new InterpolateHtmlPlugin({
      HEAD: '',
      BODY_SCRIPT: '',
      MARKUP: '',
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, '..', 'template', 'index.cordova.html'),
    }),
  ],
};

const config = webpackMerge(
  common,
  configs.configureEnv('cordova'),
  configs.configureStylesheet(),
  base
);

module.exports = config;
