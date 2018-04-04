const { Router: createRouter } = require('express');
const createSigninRouting = require('./signin');
const createSignupRouting = require('./signup');

const getRouter = () => {
  const router = createRouter();
  createSigninRouting(router);
  createSignupRouting(router);

  return router;
};

module.exports = getRouter;
