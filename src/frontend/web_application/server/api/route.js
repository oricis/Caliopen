'use strict';

var router = require('express').Router();
var debug = require('debug')('caliopen.web:api');
var path = require('path');

// For options, see:
// https://github.com/nodejitsu/node-http-proxy
var proxy = require('http-proxy').createProxyServer({
  xfwd: true,
});

proxy.on('error', function errorCallback(err, req) {
  debug(err, req.url);
});
router.use(function proxyRouting(req, res) {
  //TODO refactor in Auth library may be or ...
  req.headers.Authorization = 'Bearer ' + new Buffer(req.user.user_id + ':' + req.user.tokens.access_token).toString('base64');
  // include root path in proxied request
  req.url = path.join(req.config.api.prefix, req.url);
  var options = { target: 'http://' + req.config.api.hostname + ':' + req.config.api.port };
  proxy.web(req, res, options);
});

module.exports = router;
