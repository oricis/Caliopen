const path = require('path');
const baseConfig = require('./config.js');

const isDev = process.env.NODE_ENV === 'development';
const KOTATSU_PUBLIC_PATH = '/build/';

let config = Object.assign(baseConfig.getBase('server'), {
  target: 'node',
  entry: [path.join(__dirname, '../server/index.js')],
  output: {
    path: path.join(__dirname, '../dist/server/'),
    filename: 'index.js',
    publicPath: isDev ? KOTATSU_PUBLIC_PATH : '/assets/',
  },
});

config.module.loaders.push(
  {
    test: /\.jsx?$/,
    include: path.join(__dirname, '../server/'),
    loaders: ['babel-loader'],
  }
);

config = baseConfig.configureStylesheet(config, 'style.css', isDev ? KOTATSU_PUBLIC_PATH : '/public/assets/');
config = baseConfig.configureAssets(config, isDev ? KOTATSU_PUBLIC_PATH : '/public/assets/');

if (isDev) {
  config.output = {
    path: path.join(__dirname, '../.kotatsu/'),
    filename: 'bundle.js',
  };
}

module.exports = config;
