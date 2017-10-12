const { version } = require('../package.json');

module.exports = {
  version: process.env.CALIOPEN_VERSION || `v${version}`,
  port: process.env.CALIOPEN_PORT || 4000,
  hostname: process.env.CALIOPEN_HOSTNAME,
  api: {
    protocol: process.env.CALIOPEN_API_PROTOCOL || 'http',
    hostname: process.env.CALIOPEN_API_HOSTNAME || 'api.dev.caliopen.org',
    port: process.env.CALIOPEN_API_PORT || 31415,
    // XXX: not yet implemented
    checkCertificate: process.env.CALIOPEN_CHECK_CERTIFICATE || true,
  },
  cookie: {
    secret: process.env.CALIOPEN_COOKIE_SECRET || '_4+%J;_F&?#!+mR&IsYq:Xg4A*wvse',
  },
  seal: {
    secret: process.env.CALIOPEN_SEAL_SECRET || 'D}(2$5q)#_#yKX90,+0d5?4**a6ws8e`', // at least 32 chars
  },
};
