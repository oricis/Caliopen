const security = require('./security');

describe('security middleware', () => {
  it('has an unsecure url', () => {
    const req = {
      path: '/auth/signup',
    };

    security(req, {}, () => {});

    expect(req.security).toEqual(false);
  });

  it('has a secure url', () => {
    const req = {
      path: '/api',
    };

    security(req, {}, () => {});

    expect(req.security).toEqual(true);
  });

  it('has an unsecure public path', () => {
    const req = {
      path: '/assets/whatever.css',
    };

    security(req, {}, () => {});

    expect(req.security).toEqual(false);
  });
});
