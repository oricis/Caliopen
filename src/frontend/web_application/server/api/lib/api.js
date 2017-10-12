const http = require('http');
const debug = require('debug')('caliopen.web:app:api-query');
const getConfig = require('../../config');

const { api: { protocol, hostname, port } } = getConfig();

function query(params) {
  const options = Object.assign({
    protocol: `${protocol}:`, hostname, port,
  }, this.defaults || {}, params);
  let postData;


  if (options.body) {
    postData = JSON.stringify(options.body);
    delete options.body;
    options.headers['Content-Length'] = Buffer.byteLength(postData);
  }

  debug('\n', 'Preparing API query:', '\n', options);

  const req = http.request(options, function queryResponseCallback(res) {
    debug(
      '\n',
      'API query response:',
      '\n',
      res.statusCode,
      res.statusMessage,
      res.headers
    );

    const data = [];

    res.on('data', function dataCallback(chunk) {
      data.push(chunk);
    });

    res.on('end', function endCallback() {
      try {
        let responseBody = Buffer.concat(data).toString();

        if (res.headers['content-type'] && res.headers['content-type'].indexOf('json') !== -1) {
          responseBody = JSON.parse(responseBody);
        }

        if (res && res.statusCode >= 200 && res.statusCode < 300) {
          !options.success || options.success(responseBody);
        } else {
          const error = new Error(
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

  if (postData) {
    req.write(postData);
  }

  debug('\n','Outgoing API query:', '\n', req);

  req.end();

  return req;
}

module.exports = {
  query: query,
};
