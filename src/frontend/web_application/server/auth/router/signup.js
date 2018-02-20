const proxy = require('express-http-proxy');
const seal = require('../lib/seal');
const Auth = require('../lib/Auth');
const { getConfig, getApiHost } = require('../../config');
const { COOKIE_NAME, COOKIE_OPTIONS } = require('../lib/cookie');
const { DEFAULT_REDIRECT } = require('../lib/redirect');

const authenticateAfterSignup = (req, res, next) => {
  const { username, password } = req.body;
  const auth = new Auth();

  auth.authenticate({
    username,
    password,
    response: function responseCallback(response) {
      if (req.accepts('json')) {
        res.status(response.statusCode);
      }
    },
    success: function successCallback(user) {
      if (!user || !Object.keys(user).length) {
        next(new Error('Expected user to be defined and not empty in Auth API success callback'));

        return;
      }

      const { seal: { secret } } = getConfig();

      seal.encode(
        user,
        secret,
        (err, sealed) => {
          if (err || !seal) {
            next(err || new Error('Unexpected Error'));

            return;
          }
          res.cookie(COOKIE_NAME, sealed, COOKIE_OPTIONS);
          const redirect = req.query.redirect || DEFAULT_REDIRECT;
          res.redirect(redirect);
        }
      );
    },
    error: () => {
      const error = new Error('Unable to automatically authenticate after signup');
      error.status = 502;
      next(error);
    },
  });
};

const createSignupRouting = (router) => {
  const target = getApiHost();

  router.post('/signup', proxy(target, {
    proxyReqPathResolver: () => '/api/v1/users',
    skipToNextHandlerFilter: proxyRes => proxyRes.statusCode === 200,
  }));
  router.post('/signup', authenticateAfterSignup);
};

module.exports = createSignupRouting;
