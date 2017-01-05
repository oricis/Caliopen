const express = require('express');
const applySSR = require('./ssr');
const applyAssets = require('./assets');

const app = express();

app.set('port', (process.env.PORT || 3000));

//-------
applySSR(app);
applyAssets(app);

module.exports = app;
