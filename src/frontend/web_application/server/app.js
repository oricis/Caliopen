import express from 'express';
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
  applySSR(app);
  applyError(app);

  return app;
};
