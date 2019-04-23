import { Router as createRouter } from 'express';
import createSigninRouting from './signin';
import createSignupRouting from './signup';

const getRouter = () => {
  const router = createRouter();
  createSigninRouting(router);
  createSignupRouting(router);

  return router;
};

export default getRouter;
