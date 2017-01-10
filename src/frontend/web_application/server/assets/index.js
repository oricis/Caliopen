const express = require('express');

module.exports = (app) => {
  const { publicPath } = app.get('coConfig');
  app.use('/public', express.static(publicPath));
};
