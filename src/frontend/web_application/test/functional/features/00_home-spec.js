const userUtil = require('../utils/user-util');

describe('Home', () => {
  const EC = protractor.ExpectedConditions;

  describe('Authentication', () => {
    afterEach(() => {
      userUtil.signout();
    });

    it('Log In', async () => {
      await userUtil.signin();
      await browser.wait(EC.presenceOf(element(by.css('.m-application-switcher .m-navbar-item__content'))));
      expect(element(by.css('.m-application-switcher .m-navbar-item__content')).getText()).toContain('MESSAGES');
    });

    it('Requires authentication', async () => {
      browser.get('/');
      await browser.wait(EC.presenceOf(element(by.css('.s-signin__action'))), 1000);

      expect(element(by.css('.s-signin__action .m-button')).getText()).toContain('I\'m in a safe place');
    });

    it('Log out', async () => {
      await userUtil.signin();
      await userUtil.signout();
      await browser.wait(EC.presenceOf(element(by.css('.s-signin__action'))), 1000);

      expect(element(by.css('.s-signin__action .m-button')).getText()).toContain('I\'m in a safe place');
    });
  });
});
