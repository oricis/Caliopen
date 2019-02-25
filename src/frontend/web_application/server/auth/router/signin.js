const proxy = require('express-http-proxy');
const { getApiHost } = require('../../config');
const { COOKIE_NAME, authenticate } = require('../lib/cookie');

const createLoginRouting = (router) => {
  const target = getApiHost();

  router.post('/signin', proxy(target, {
    proxyReqPathResolver: () => '/api/v1/authentications',
    userResDecorator: async (proxyRes, proxyResData, userReq, userRes) => {
      if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 400) {
        const { device, ...user } = JSON.parse(proxyResData.toString('utf8'));

        // according to the doc, cookie manipulation.should not be done in userResDecorator but
        // possible since userRes is pass as a reference
        await authenticate(userRes, { user });

        return JSON.stringify({ device });
      }

      return proxyResData;
    },
  }));

  router.get('/signout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    const redirect = (() => {
      const parts = req.originalUrl.split('redirect=');

      return parts.length > 1 ? `?redirect=${parts[parts.length - 1]}` : '';
    })();
    // XXX: render a temporary confirmation on next rendering
    res.redirect(`/auth/signin${redirect}`);
  });
};

module.exports = createLoginRouting;
