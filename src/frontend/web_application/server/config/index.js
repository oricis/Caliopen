const merge = require('lodash.merge');
const defaults = require('../../config/server.default.js');
const envVars = require('../../config/server.env-var.js');

let config = merge(defaults, envVars);

const initConfig = (forceDefaults) => {
  config = merge(defaults, forceDefaults, envVars);
};

const getConfig = () => config;

const getApiHost = () => {
  const { api: { hostname, port, protocol } } = getConfig();

  return `${protocol}://${hostname}:${port}`;
};

module.exports = {
  getConfig,
  getApiHost,
  initConfig,
};
