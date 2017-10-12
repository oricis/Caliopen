const http = require('http');
const app = require('./app');
const getConfig = require('./config');

const server = http.createServer(app);
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
