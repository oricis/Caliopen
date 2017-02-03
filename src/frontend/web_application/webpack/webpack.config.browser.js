const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./config.js');

const KOTATSU_PUBLIC_PATH = '/build/';
const KOTATSU_ASSETS_PUBLIC_PATH = '';
const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

let config = Object.assign(baseConfig.getBase('browser'), {
  entry: [
    'script-loader!jquery',
    'script-loader!foundation-sites',
    path.join(__dirname, '../src/index.jsx'),
  ],
  output: {
    path: isTest ? path.join(__dirname, '..', 'dist/browser/') : path.join(__dirname, '..', 'dist/server/public/'),
    filename: 'bundle.js',
    publicPath: isDev ? KOTATSU_PUBLIC_PATH : '/assets/',
  },
});

if (isTest) {
  config.entry.push(path.join(__dirname, '../template/index.test.html'));
  config.module.loaders.push({
    test: /\.html$/,
    loader: 'file-loader?name=index.html&outputPath=/',
  });
}

config = baseConfig.configureStylesheet(config, 'client.css', isDev ? KOTATSU_ASSETS_PUBLIC_PATH : '/assets/');
config = baseConfig.configureAssets(config, isDev ? KOTATSU_ASSETS_PUBLIC_PATH : '/assets/');

if (isDev) {
  config.entry.unshift(
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    'webpack/hot/only-dev-server'
  );

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

let uglifyJSOptions = {};

if (!isProd) {
  uglifyJSOptions = {
    beautify: true,
    mangle: false,
    compress: {
      warnings: false,
    },
  };
}

config.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyJSOptions));

module.exports = config;
