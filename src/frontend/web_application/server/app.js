const express = require('express');
const applyAPI = require('./api');
const applySSR = require('./ssr');
const applySecurity = require('./security');
const applyAssets = require('./assets');
const applyAuth = require('./auth');
const applyConfig = require('./config');
const applyError = require('./error');

const app = express();

app.set('port', (process.env.PORT || 4000));

//-------
applyConfig(app);
applySecurity(app);
applyAssets(app);
applyAuth(app);
applyAPI(app);
applySSR(app);
applyError(app);

module.exports = app;
