const { Router } = require('express');

const seal = require('./lib/seal');
const Auth = require('./lib/Auth');

const router = new Router();

router.get('/login', (req, res) => {
  if (req.tokens) {
    return res.redirect(req.config.frontend.rootPath);
  }

  const devInfos = {
    hasInstanceInfo: Object.keys(req.config.instanceInfo).length > 0,
    version: req.config.version,
    login: req.config.instanceInfo.login,
    password: req.config.instanceInfo.password,
  };

  return res.render('login', devInfos);
});

router.post('/login', (req, res, next) => {
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

  if (!values.username || !values.password) {
    res.render('login', { error: 'Username or password invalid' });

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
        res.render('login', { error: 'Username or password invalid' });

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
