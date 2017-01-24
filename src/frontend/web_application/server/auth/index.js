const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./router');
const { checkCookie, decodeCookie, checkToken, catchLoginErrors } = require('./middlewares');

module.exports = (app) => {
  app.use('/auth', bodyParser.urlencoded({ extended: false }));
  app.use('/auth', router);

  app.use(
    cookieParser(),
    checkCookie,
    decodeCookie,
    checkToken,
    catchLoginErrors
  );
};
