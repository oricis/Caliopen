import express from 'express';
import path from 'path';
import applyAPI from './api';
import applySecurity from './security';
import applyAssets from './assets';
import applyAuth from './auth';
import applyError from './error';
import { configure as applyExpressReact } from './express-react';
import applySSR from './ssr';

export default () => {
  const app = express();

  //-------
  // assets always public
  applyAssets(app);
  applySecurity(app);
  applyAuth(app);
  applyAPI(app);
  applyExpressReact(app);

  if (process.env.HAS_SSR !== false && process.env.HAS_SSR !== 'false') {
    applySSR(app);
  } else {
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('./dist/server/template.html'));
    });
  }
  applyError(app);

  return app;
};
