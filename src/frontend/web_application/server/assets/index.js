const express = require('express');
const favicon = require('serve-favicon');

module.exports = (app) => {
  const { publicPaths, faviconPath } = app.get('coConfig');
  app.use(favicon(faviconPath));
  Object.keys(publicPaths).forEach((target) => {
    publicPaths[target].forEach((path) => {
      app.use(target, express.static(path));
    });
  });
};
