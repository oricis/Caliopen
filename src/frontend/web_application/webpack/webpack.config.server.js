const path = require('path');
const baseConfig = require('./config.js');

const isDev = process.env.NODE_ENV === 'development';

const config = Object.assign(baseConfig.getBase('server'), {
  target: 'node',
  entry: [path.join(__dirname, '../server/index.js')],
  output: {
    path: path.join(__dirname, '../dist/server/'),
    filename: 'index.js',
    publicPath: '/public/',
  },
});

config.module.loaders.push(
  {
    test: /\.css$/,
    loader: 'null',
  },
  {
    test: /\.scss$/,
    loader: 'null',
  },
  {
    test: /\.jsx?$/,
    include: path.join(__dirname, '../server/'),
    loaders: ['babel-loader'],
  }
);

if (isDev) {
  config.output = {
    path: path.join(__dirname, '../.kotatsu/'),
    filename: 'bundle.js',
  };
}

module.exports = config;
