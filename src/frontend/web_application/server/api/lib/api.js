'use strict';

var http = require('http');
var ObjectAssign = Object.assign || require('object-assign');
var debug = require('debug')('caliopen.web:app:api-query');

function query(params) {
  var options = ObjectAssign({}, this.defaults || {}, params);

  if (options.body) {
    options.body = JSON.stringify(options.body);
    options.headers['Content-Length'] = Buffer.byteLength(options.body);
  }

  debug('\n','Preparing API query:', '\n', options);

  var req = http.request(options, function queryResponseCallback(res) {
    debug(
      '\n',
      'API query response:',
      '\n',
      res.statusCode,
      res.statusMessage,
      res.headers
    );

    var data = [];

    res.on('data', function dataCallback(chunk) {
      data.push(chunk);
    });

    res.on('end', function endCallback() {
      try {
        var responseBody = Buffer.concat(data).toString();

        if (res.headers['content-type'] && res.headers['content-type'].indexOf('json') !== -1) {
          responseBody = JSON.parse(responseBody);
        }

        if (res && res.statusCode >= 200 && res.statusCode < 300) {
          !options.success || options.success(responseBody);
        } else {
          var error = new Error(
            'API Query Error ' + res.statusCode + ' : ' + res.statusMessage
          );
          error.status = res.statusCode;
          throw error;
        }
      } catch (e) {
        e.status = e.status || 500;
        !options.error || options.error(e);
      }
    });

  }).on('response', options.response)
    .on('error', options.error);

  if (options.body) {
    req.write(options.body);
  }

  debug('\n','Outgoing API query:', '\n', req);

  req.end();

  return req;
}

module.exports = {
  query: query,
};
