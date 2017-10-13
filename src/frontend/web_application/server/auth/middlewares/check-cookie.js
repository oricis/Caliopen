const { COOKIE_NAME } = require('../lib/cookie');

const checkCookie = (req, res, next) => {
  const cookie = req.signedCookies && req.signedCookies[COOKIE_NAME];

  if (!cookie) {
    if (req.security === false) {
      next();

      return;
    }

    const error = new Error('Unauthorized');
    error.status = 401;

    next(error);

    return;
  }

  req.seal = cookie;

  next();
};

module.exports = checkCookie;
