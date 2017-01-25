const { security } = require('./middlewares');

module.exports = (app) => {
  app.use(security);
};
