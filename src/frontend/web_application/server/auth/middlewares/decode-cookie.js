import { decode } from '../lib/seal';
import { getConfig } from '../../config';

export const decodeCookieMiddleware = (req, res, next) => {
  const { seal: { secret } } = getConfig();
  const seal = req.seal;

  if (!seal && req.security === false) {
    next();

    return;
  }

  decode(seal, secret, (err, obj) => {
    if (err || !obj) {
      const error = new Error('Unexpected Server Error on cookie decoding');
      error.status = 500;
      error.err = err;

      next(error);

      return;
    }

    req.user = obj;

    next();
  });
};
