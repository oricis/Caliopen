import { encode } from '../lib/seal';
import { getConfig } from '../../config';

export const COOKIE_NAME = 'caliopen.web';
export const COOKIE_OPTIONS = {
  signed: true,
  domain: undefined,
  path: '/',
};

export const authenticate = (res, { user }) => new Promise((resolve, reject) => {
  const { seal: { secret }, hostname } = getConfig();

  encode(
    user,
    secret,
    (err, sealed) => {
      if (err || !sealed) {
        return reject('Unexpected Error');
      }
      res.cookie(COOKIE_NAME, sealed, { ...COOKIE_OPTIONS, domain: hostname });

      return resolve();
    }
  );
});
