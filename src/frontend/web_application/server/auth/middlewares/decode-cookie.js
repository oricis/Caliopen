const cyphered = require('../lib/seal');

const decodeCookie = (req, res, next) => {
  const seal = req.seal;

  cyphered.decode(seal, req.config.seal.secret, (err, obj) => {
    if (err || !obj) {
      const error = new Error('Unexpected Server Error');
      error.status = 500;
      error.err = err;

      return next(error);
    }

    req.user = obj;

    return next();
  });
};

module.exports = decodeCookie;
