const express = require('express');
const path = require('path');
const applyAPI = require('./api');
const applySecurity = require('./security');
const applyAssets = require('./assets');
const applyAuth = require('./auth');
const applyError = require('./error');
const { configure: applyExpressReact } = require('./express-react');

module.exports = () => {
  const app = express();

  //-------
  // assets always public
  applyAssets(app);
  applySecurity(app);
  applyAuth(app);
  applyAPI(app);
  applyExpressReact(app);

  if (process.env.HAS_SSR !== false && process.env.HAS_SSR !== 'false') {
    // eslint-disable-next-line global-require
    const applySSR = require('./ssr');
    applySSR(app);
  } else {
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('./dist/server/template.html'));
    });
  }
  applyError(app);

  return app;
};
