const seal = require('../lib/seal');
const { getConfig } = require('../../config');

const COOKIE_NAME = 'caliopen.web';
const COOKIE_OPTIONS = {
  signed: true,
};

const authenticate = (res, { user }) => new Promise((resolve, reject) => {
  const { seal: { secret } } = getConfig();

  seal.encode(
    user,
    secret,
    (err, sealed) => {
      if (err || !seal) {
        return reject('Unexpected Error');
      }
      res.cookie(COOKIE_NAME, sealed, COOKIE_OPTIONS);

      return resolve();
    }
  );
});

module.exports = {
  authenticate,
  COOKIE_NAME,
  COOKIE_OPTIONS,
};
