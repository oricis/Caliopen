const userUtil = require('../utils/user-util');

describe('Home', () => {
  const EC = protractor.ExpectedConditions;
  const locale = 'en';
  const __ = key => ({
    fr: {
      login: 'Connexion',
    },
    en: {
      login: 'Login',
    },
  }[locale][key]);

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

      expect(element(by.css('.s-signin__action .m-button')).getText()).toContain(__('login'));
    });

    it('Log out', () => {
      userUtil.signin();
      userUtil.signout();
      expect(element(by.css('.s-signin__action .m-button')).getText()).toContain(__('login'));
    });
  });
});
