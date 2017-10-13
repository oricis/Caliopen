const express = require('express');
const favicon = require('serve-favicon');

const PUBLIC_PATHS = {
  '/': ['dist/server/public/', 'public/'],
};
const FAVICON_PATH = 'public/favicon.ico';

module.exports = (app) => {
  app.use(favicon(FAVICON_PATH));
  Object.keys(PUBLIC_PATHS).forEach((target) => {
    PUBLIC_PATHS[target].forEach((path) => {
      app.use(target, express.static(path));
    });
  });
};
