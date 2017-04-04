require('babel-core/register');
require('babel-polyfill');

module.exports = {
  default: [
    require('./authentications').default,
    require('./me').default,
    require('./discussions').default,
    require('./messages').default,
    require('./tags').default,
  ],
};
