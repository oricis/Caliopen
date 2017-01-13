const catchLoginErrorsMiddleware = (err, req, res, next) => {
  if (err.status === 401 && req.accepts('html')) {
    const redirectTo = `/auth/login?redirect=${req.originalUrl.split('?')[0]}`;
    res.redirect(redirectTo);

    return;
  }

  next(err);
};

module.exports = catchLoginErrorsMiddleware;
