import express from 'express';
import favicon from 'serve-favicon';

const PUBLIC_PATHS = {
  '/': ['dist/server/public/', 'public/'],
};
const FAVICON_PATH = 'public/favicon.ico';

export default (app) => {
  app.use(favicon(FAVICON_PATH));
  Object.keys(PUBLIC_PATHS).forEach((target) => {
    PUBLIC_PATHS[target].forEach((path) => {
      app.use(target, express.static(path));
    });
  });
};
