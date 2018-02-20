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
      expect(element(by.css('.m-application-switcher .m-navbar-item__content')).getText()).toContain('MESSAGES');
    });

    it('Requires authentication', () => {
      browser.get('/');
      browser.wait(EC.presenceOf($('.s-signin__action')), 1000);

      expect(element(by.css('.s-signin__action .m-button')).getText()).toContain('I\'m in a safe place');
    });

    it('Log out', () => {
      userUtil.signin();
      userUtil.signout();
      expect(element(by.css('.s-signin__action .m-button')).getText()).toContain('I\'m in a safe place');
    });
  });
});
