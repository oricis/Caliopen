const express = require('express');
const applySSR = require('./ssr');
const applyAssets = require('./assets');
const applyAuth = require('./auth');
const applyConfig = require('./config');

const app = express();

app.set('port', (process.env.PORT || 4000));

//-------
applyConfig(app);
applyAssets(app);
applyAuth(app);
applySSR(app);

module.exports = app;
