const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./config.js');

const PUBLIC_PATH = '/assets/';
const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

let config = Object.assign(baseConfig.getBase('browser'), {
  devtool: 'source-map',
  entry: {
    app: [
      path.join(__dirname, '../src/index.jsx'),
    ],
    vendor: [
      'babel-polyfill',
      'script-loader!jquery',
      'script-loader!foundation-sites',
    ],
  },
  output: {
    path: path.join(__dirname, '..', 'dist/server/public/assets'),
    filename: '[name].[chunkhash].js',
    publicPath: PUBLIC_PATH,
  },
});

if (isDev) {
  config = Object.assign(config, {
    devServer: {
      contentBase: false,
      hot: true,
      port: '8080',
      proxy: {
        '/': {
          target: 'http://localhost:4001',
        },
      },
    },
  });
}

config = baseConfig.configureStylesheet(config, 'client.css');
config = baseConfig.configureAssets(config);
config = baseConfig.configureVendorSplit(config);
config = baseConfig.configureHTMLTemplate(config);

// FIXME: fail to build with code-splitting
// if (isDev) {
//   config.entry.app.unshift(
//     'react-hot-loader/patch',
//     'webpack-hot-middleware/client',
//     'webpack/hot/only-dev-server'
//   );
//
//   config.plugins.unshift(
//     new webpack.HotModuleReplacementPlugin()
//   );
// }

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

config.module.loaders.push({ test: /\.json$/, loader: 'json-loader' });
config.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyJSOptions));

module.exports = config;
