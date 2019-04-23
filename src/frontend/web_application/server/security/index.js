import { securityMiddleware } from './middlewares';

export default (app) => {
  app.use(securityMiddleware);
};
