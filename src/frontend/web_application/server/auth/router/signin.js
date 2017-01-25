const seal = require('../lib/seal');
const Auth = require('../lib/Auth');

const ERR_REQUIRED = 'ERR_REQUIRED';
const ERR_INVALID = 'ERR_INVALID';

const createLoginRouting = (router) => {
  router.post('/signin', (req, res, next) => {
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
      errors.username = [ERR_REQUIRED];
    }

    if (!values.password) {
      hasError = true;
      errors.password = [ERR_REQUIRED];
    }

    if (hasError) {
      res.status(400).send({ errors });

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

            if (!req.xhr) {
              const redirect = req.query.redirect || '/';
              const url = `${req.config.frontend.rootPath.replace(/\/$/, '')}${redirect}`;
              res.redirect(url);
            } else {
              res.send({ success: 'success' });
            }
          }
        );
      },
      error: (error) => {
        error = error || new Error('Bad gateway');
        if (error.status && error.status >= 400 && error.status < 500) {
          res.status(error.status);
          errors.global = [ERR_INVALID];
          res.status(400).send({ errors });

          return;
        }

        error.status = error.status || 502;
        next(error);
      },
    });
  });

  router.get('/signout', (req, res) => {
    res.clearCookie(req.config.cookie.name);
    // XXX: render a temporary confirmation on next rendering
    res.redirect('signin');
  });
};

module.exports = createLoginRouting;
