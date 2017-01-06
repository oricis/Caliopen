const path = require('path');
const nunjucks = require('nunjucks');
const makeConfig = require('../cfg');

module.exports = (app) => {
  const config = makeConfig(app.get('env'));
  app.set('view engine', 'html');
  nunjucks.configure(path.join(__dirname, '..', 'views'), {
    autoescape: true,
    express: app,
  });


  app.use((req, res, next) => {
    req.config = config;
    next();
  });
};
