const { version } = require('../package.json');

module.exports = {
  // render current release version in the auth pages
  version: process.env.CALIOPEN_VERSION || `v${version}`,
  // optional display a motd in auth pages for the release
  motd: process.env.CALIOPEN_MOTD,
  piwik: {
    siteId: process.env.CALIOPEN_PIWIK_SITE_ID === 'false' ? false : 6,
  },
};
