const route = require('./route.js');

module.exports = (app) => {
  app.use('/api', route);
};
