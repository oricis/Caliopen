import catchError from './middlewares/catch-error';

export default (app) => {
  app.use(catchError);
};
