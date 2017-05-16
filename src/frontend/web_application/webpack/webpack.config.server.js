const path = require('path');
const baseConfig = require('./config.js');

const isDev = process.env.NODE_ENV === 'development';
const KOTATSU_PUBLIC_PATH = '/build/';

const config = Object.assign(baseConfig.getBase('server'), {
  target: 'node',
  entry: ['babel-polyfill', path.join(__dirname, '../server/index.js')],
  output: {
    path: path.join(__dirname, '../dist/server/'),
    filename: 'index.js',
    publicPath: isDev ? KOTATSU_PUBLIC_PATH : '/',
  },
});

config.module.loaders.push(
  {
    test: /\.(s?css|jpe?g|png|gif)$/,
    loaders: ['null-loader'],
  },
  {
    test: /\.jsx?$/,
    include: path.join(__dirname, '../server/'),
    loaders: ['babel-loader'],
  },
  { test: /\.html$/, loader: 'raw-loader' }
);

if (isDev) {
  config.output = {
    path: path.join(__dirname, '../.kotatsu/'),
    filename: 'bundle.js',
  };
}

module.exports = config;
