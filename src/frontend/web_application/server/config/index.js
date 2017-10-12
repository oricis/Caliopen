const merge = require('lodash.merge');
const defaults = require('../../config/server.default.js');
const envVars = require('../../config/server.env-var.js');

let config = merge(defaults, envVars);

module.exports = {
  getConfig: () => config,
  initConfig: (forceDefaults) => {
    config = merge(defaults, forceDefaults, envVars);
  },
};
