const checkCookie = (req, res, next) => {
  const cookie = req.cookies && req.cookies[req.config.cookie.name];

  if (!cookie) {
    const error = new Error('Unauthorized');
    error.status = 401;

    return next(error);
  }

  req.seal = cookie;

  return next();
};

module.exports = checkCookie;
