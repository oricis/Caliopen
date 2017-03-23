const proxy = require('express-http-proxy');
const url = require('url');

module.exports = (app) => {
  const { api: { hostname, port } } = app.get('coConfig');
  const target = `http://${hostname}:${port}`;

  app.use('/api', proxy(target, {
    forwardPath: req => url.parse(req.originalUrl).path,
    decorateRequest: (proxyReq, req) => {
      if (!req.security) {
        return;
      }

      // TODO refactor in Auth library may be or ...
      const bearer = new Buffer(`${req.user.user_id}:${req.user.tokens.access_token}`)
        .toString('base64');
      proxyReq.headers.Authorization = `Bearer ${bearer}`;
    },
  }));
};
