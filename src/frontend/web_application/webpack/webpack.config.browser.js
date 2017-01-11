const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./config.js');

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
    publicPath: isDev ? '/build/' : '/public/',
  },
});

config = baseConfig.configureStylesheet(config);

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
