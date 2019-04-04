import locale from 'locale';
import cookieParser from 'cookie-parser';
import ssrMiddleware from './ssr-middleware';

const supportedLocales = ['en-US', 'fr-FR'];

export default (app) => {
  app.use(locale(supportedLocales));
  app.use(cookieParser());
  app.get('*', ssrMiddleware);
};
