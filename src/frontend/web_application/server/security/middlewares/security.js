const securityMiddleware = (req, res, next) => {
  const security = {
    firewalls: {
      auth: {
        paths: ['/auth/signin', '/auth/signup'],
        security: false,
      },
      default: {
        security: true,
      },
    },
  };

  const hasRequestPath = paths => paths.indexOf(req.path) !== -1;

  const isSecure = Object.keys(security.firewalls)
    .filter(key => key !== 'default')
    .reduce((prev, curr) => {
      if (prev !== undefined) {
        return prev;
      }

      if (hasRequestPath(security.firewalls[curr].paths)) {
        return security.firewalls[curr].security;
      }

      return prev;
    }, undefined);

  req.security = isSecure !== undefined ? isSecure : security.firewalls.default.security;

  next();
};

module.exports = securityMiddleware;
