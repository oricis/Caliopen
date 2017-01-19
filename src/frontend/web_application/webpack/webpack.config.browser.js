const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./config.js');

const KOTATSU_PUBLIC_PATH = '/build/';
const KOTATSU_ASSETS_PUBLIC_PATH = '';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

let config = Object.assign(baseConfig.getBase('browser'), {
  entry: [
    'script-loader!jquery',
    'script-loader!foundation-sites',
    path.join(__dirname, '../src/index.jsx'),
  ],
  output: {
    path: path.join(__dirname, '..', 'dist/server/public/'),
    filename: 'bundle.js',
    publicPath: isDev ? KOTATSU_PUBLIC_PATH : '/assets/',
  },
});

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
