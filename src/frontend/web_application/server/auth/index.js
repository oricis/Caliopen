const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const getRouter = require('./router');
const { checkCookie, decodeCookie, checkToken, catchLoginErrors } = require('./middlewares');
const { getConfig } = require('../config');

module.exports = (app) => {
  const { cookie: { secret } } = getConfig();
  app.use(cookieParser(secret));
  app.use('/auth', bodyParser.json());
  app.use('/auth', bodyParser.urlencoded({ extended: false }));
  app.use('/auth', getRouter());

  app.use(
    checkCookie,
    decodeCookie,
    checkToken,
    catchLoginErrors
  );
};
