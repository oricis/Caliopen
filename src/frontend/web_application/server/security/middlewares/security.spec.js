import { securityMiddleware } from './security';

describe('security middleware', () => {
  it('has an unsecure url', () => {
    const req = {
      path: '/auth/signup',
    };

    securityMiddleware(req, {}, () => {});

    expect(req.security).toEqual(false);
  });

  it('has a secure url', () => {
    const req = {
      path: '/api',
    };

    securityMiddleware(req, {}, () => {});

    expect(req.security).toEqual(true);
  });
});
