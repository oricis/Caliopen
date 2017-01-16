const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const route = require('./route.js');
const { checkCookie, decodeCookie, checkToken, catchLoginErrors } = require('./middlewares');

module.exports = (app) => {
  app.use('/auth', bodyParser.urlencoded({ extended: false }));
  app.use('/auth', route);

  app.use(
    cookieParser(),
    checkCookie,
    decodeCookie,
    checkToken,
    catchLoginErrors
  );
};
