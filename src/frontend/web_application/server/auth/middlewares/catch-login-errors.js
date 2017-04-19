const catchLoginErrorsMiddleware = (err, req, res, next) => {
  if (err.status === 401 && !req.xhr && req.ip.indexOf('127.0.0.1') === -1) {
    const redirectTo = `/auth/signin?redirect=${req.originalUrl.split('?')[0]}`;
    res.redirect(redirectTo);

    return;
  }

  next(err);
};

module.exports = catchLoginErrorsMiddleware;
