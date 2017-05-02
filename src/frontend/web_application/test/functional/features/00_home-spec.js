const userUtil = require('../utils/user-util');

describe('Home', () => {
  const EC = protractor.ExpectedConditions;

  describe('Authentication', () => {
    afterEach(() => {
      userUtil.signout();
    });

    it('Log In', () => {
      userUtil.signin();
      browser.get('/');
      expect(element(by.css('.m-application-switcher .m-navbar-item__content')).getText()).toContain('Discussions');
    });

    it('Requires authentication', () => {
      browser.get('/');
      browser.wait(EC.presenceOf($('.m-title__text')), 1000);

      expect(element(by.css('.m-title__text')).getText()).toContain('PLEASE LOG IN');
    });

    it('Log out', () => {
      userUtil.signin();
      userUtil.signout();
      expect(element(by.css('.m-title__text')).getText()).toContain('PLEASE LOG IN');
    });
  });
});
