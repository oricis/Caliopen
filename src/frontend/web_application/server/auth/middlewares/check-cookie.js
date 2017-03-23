const checkCookie = (req, res, next) => {
  const cookie = req.cookies && req.cookies[req.config.cookie.name];

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
