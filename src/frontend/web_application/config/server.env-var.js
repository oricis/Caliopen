module.exports = {
  version: process.env.CALIOPEN_VERSION,
  port: process.env.CALIOPEN_PORT,
  hostname: process.env.CALIOPEN_HOSTNAME,
  api: {
    protocol: process.env.CALIOPEN_API_PROTOCOL,
    hostname: process.env.CALIOPEN_API_HOSTNAME,
    port: process.env.CALIOPEN_API_PORT,
    checkCertificate: process.env.CALIOPEN_CHECK_CERTIFICATE,
  },
  cookie: {
    secret: process.env.CALIOPEN_COOKIE_SECRET,
  },
  seal: {
    secret: process.env.CALIOPEN_SEAL_SECRET,
  },
};
