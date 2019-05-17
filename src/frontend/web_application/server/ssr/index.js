import cookieParser from 'cookie-parser';
import ssrMiddleware from './ssr-middleware';

export default (app) => {
  app.use(cookieParser());
  app.get('*', ssrMiddleware);
};
