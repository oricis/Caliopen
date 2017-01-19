const express = require('express');

module.exports = (app) => {
  const { publicPaths } = app.get('coConfig');
  Object.keys(publicPaths).forEach((target) => {
    publicPaths[target].forEach((path) => {
      app.use(target, express.static(path));
    });
  });
};
