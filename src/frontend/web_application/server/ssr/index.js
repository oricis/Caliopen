const ssrMiddleware = require('./ssr-middleware.js');
const locale = require('locale');
const cookieParser = require('cookie-parser');

const supportedLocales = ['en', 'fr'];

module.exports = (app) => {
  app.use(locale(supportedLocales));
  app.use(cookieParser());
  app.get('*', ssrMiddleware);
};
