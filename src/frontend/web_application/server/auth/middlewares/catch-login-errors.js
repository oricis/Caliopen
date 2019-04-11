import { isSubRequest } from '../../api/lib/sub-request-manager';

export const catchLoginErrorsMiddleware = (err, req, res, next) => {
  if (err.status === 401 && !req.xhr && !isSubRequest(req)) {
    const redirectTo = `/auth/signin?redirect=${req.originalUrl.split('?')[0]}`;
    res.redirect(redirectTo);

    return;
  }

  next(err);
};
