const path = require('path');
const fs = require('fs');
const argv = require('argv');
const http = require('http');
const getApp = require('./app');
const { getConfig, initConfig } = require('./config');
const { version } = require('../package.json');

const { options: { options: optionPath } } = argv
  .option([
    {
      name: 'options',
      type: 'path',
      description: 'the file to set Caliopen options. See config/server.default.js for default options. This can be a regular js or a json file, cf. README.md.',
      example: 'server --options=~/caliopen.webserver.json',
    },
  ])
  .version(version)
  .info('Run Caliopen web server')
  .run()
;

if (optionPath) {
  // read user's config file outside of webpack
  const userOpts = JSON.parse(fs.readFileSync(path.join(optionPath), 'utf8'));
  initConfig(userOpts);
}

const server = http.createServer(getApp());
const { port, hostname } = getConfig();
const params = [
  port,
  ...(hostname ? [hostname] : []),
  () => {
    const { address, port: runningPort } = server.address();
    console.log(`Server started: http://${address}:${runningPort}/`);
  },
];

server.listen(...params);
