require('babel-core/register');
require('babel-polyfill');

module.exports = {
  default: [
    require('./authentications').default,
    require('./contacts').default,
    require('./devices').default,
    require('./discussions').default,
    require('./local_identities').default,
    require('./me').default,
    require('./messages').default,
    require('./notifications').default,
    require('./oauth-mock').default,
    require('./participants').default,
    require('./providers').default,
    require('./remote_identities').default,
    require('./search').default,
    require('./settings').default,
    require('./tags').default,
  ],
};
