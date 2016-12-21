const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
    ],
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../node_modules/foundation-sites/scss'),
    ],
  },
};
