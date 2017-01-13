const isDev = process.env.NODE_ENV === 'development';

const catchError = (err, req, res, next) => {
  const publicError = {
    status: err.status,
    message: err.message,
    error: isDev ? err : {},
    stack: isDev ? err.stack : '',
  };

  if (req.accepts('html')) {
    res.render('error.component', publicError);

    return;
  }

  if (req.accepts('json')) {
    res.json(publicError);

    return;
  }

  next(err);
};

module.exports = catchError;
