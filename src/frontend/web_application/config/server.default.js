const { version } = require('../package.json');

module.exports = {
  version: `v${version}`,
  port: 4000,
  hostname: undefined,
  api: {
    protocol: 'http',
    hostname: 'api.dev.caliopen.org',
    port: 31415,
    // XXX: not yet implemented
    checkCertificate: true,
  },
  cookie: {
    secret: '_4+%J;_F&?#!+mR&IsYq:Xg4A*wvse',
  },
  seal: {
    secret: 'D}(2$5q)#_#yKX90,+0d5?4**a6ws8e`', // at least 32 chars
  },
};
