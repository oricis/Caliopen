const { Router } = require('express');

const seal = require('./lib/seal');
const Auth = require('./lib/Auth');

const router = new Router();
const FORM_PROPS = { action: '/auth/login', method: 'POST' };

const getDevInfos = config => ({
  hasInstanceInfo: Object.keys(config.instanceInfo).length > 0,
  version: config.version,
  login: config.instanceInfo.login,
  password: config.instanceInfo.password,
});

router.get('/login', (req, res) => {
  if (req.tokens) {
    return res.redirect(req.config.frontend.rootPath);
  }

  return res.render('login.component', { form: FORM_PROPS, devInfos: getDevInfos(req.config) });
});

router.post('/login', (req, res, next) => {
  let hasError = false;
  const errors = {};
  const auth = new Auth(req.config);

  if (!req.body || !Object.keys(req.body).length) {
    const err = new Error('Bad request');
    err.status = 400;

    throw err;
  }

  const values = {
    username: req.body.username,
    password: req.body.password,
  };

  if (!values.username) {
    hasError = true;
    errors.username = ['Username is required'];
  }

  if (!values.password) {
    hasError = true;
    errors.password = ['Password is required'];
  }

  if (hasError) {
    res.render('login.component', { form: FORM_PROPS, errors, formValues: values, devInfos: getDevInfos(req.config) });

    return;
  }

  auth.authenticate({
    username: values.username,
    password: values.password,

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
          res.redirect(req.config.frontend.rootPath);
        }
      );
    },
    error: (error) => {
      error = error || new Error('Bad gateway');
      if (error.status && error.status >= 400 && error.status < 500) {
        res.status(error.status);
        errors.global = ['Username or password is invalid'];
        res.render('login.component', { form: FORM_PROPS, errors, formValues: values, devInfos: getDevInfos(req.config) });

        return;
      }

      error.status = error.status || 502;
      next(error);
    },
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie(req.config.cookie.name);
  // XXX: render a temporary confirmation on next rendering
  res.redirect('login');
});

module.exports = router;
