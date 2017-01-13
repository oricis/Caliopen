const catchError = require('./middlewares/catch-error');

module.exports = (app) => {
  app.use(catchError);
};
