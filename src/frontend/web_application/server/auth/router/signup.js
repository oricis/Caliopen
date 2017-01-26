const seal = require('../lib/seal');
const Auth = require('../lib/Auth');

const FORM_PROPS = { action: '/auth/signup', method: 'POST' };
const ERR_REQUIRED = 'ERR_REQUIRED';
const ERR_INVALID = 'ERR_INVALID';

const getDevInfos = config => ({
  version: config.version,
});

const getFormParam = (req) => {
  const form = Object.assign({}, FORM_PROPS);

  if (req.originalUrl.indexOf('?') !== -1) {
    form.action += `?${req.originalUrl.split('?')[1]}`;
  }

  return form;
};

const authenticateAfterSignup = (req, res, next) => {
  const { username, password } = req.body;
  const auth = new Auth(req.config);

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

      seal.encode(
        user,
        req.config.seal.secret,
        (err, sealed) => {
          if (err || !seal) {
            next(err || new Error('Unexpected Error'));

            return;
          }
          res.cookie(req.config.cookie.name, sealed, req.config.cookie.options);
          const redirect = req.query.redirect || '/';
          const url = `${req.config.frontend.rootPath.replace(/\/$/, '')}${redirect}`;
          res.redirect(url);
        }
      );
    },
    error: (error) => {
      error = error || new Error('Bad gateway');
      if (error.status && error.status >= 400 && error.status < 500) {
        res.status(error.status);
        errors.global = ['Username or password is invalid'];
        res.render('login.component', { form: getFormParam(req), errors, formValues: values, devInfos: getDevInfos(req.config) });

        return;
      }

      error.status = error.status || 502;
      next(error);
    },
  });
};

const createSignupRouting = (router) => {
  router.post('/signup', (req, res, next) => {
    let hasError = false;
    const errors = {};

    if (!req.body || !Object.keys(req.body).length) {
      const err = new Error('Bad request');
      err.status = 400;

      throw err;
    }

    const values = {
      username: req.body.username,
      password: req.body.password,
      tos: req.body.tos,
    };

    if (!values.username) {
      hasError = true;
      errors.username = [ERR_REQUIRED];
    }

    if (!values.password) {
      hasError = true;
      errors.password = [ERR_REQUIRED];
    }

    if (!values.tos) {
      hasError = true;
      errors.tos = [ERR_REQUIRED];
    }

    if (hasError) {
      res.status(400).send({ errors });

      return;
    }

    const auth = new Auth(req.config);
    const { username, password } = values;

    auth.signup({
      body: {
        username,
        password,
      },
      success: function successCallback(location) {
        authenticateAfterSignup(req, res, next);
      },
      error: (error) => {
        error = error || new Error('Bad gateway');
        if (error.status && error.status >= 400 && error.status < 500) {
          errors.global = [ERR_INVALID];
          res.status(error.status).send({ errors });

          return;
        }

        error.status = error.status || 502;
        next(error);
      },
    });
  });
};

module.exports = createSignupRouting;
