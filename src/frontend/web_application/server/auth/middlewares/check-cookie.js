const getConfig = require('../../config');

const { cookie: { name: cookieName } } = getConfig();

const checkCookie = (req, res, next) => {
  const cookie = req.cookies && req.cookies[cookieName];

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
