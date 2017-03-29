const EC = protractor.ExpectedConditions;

module.exports = {
  signin: (login, password) => {
    const loginKeys = login || 'dev';
    const passwordKeys = password || '123456';
    browser.get('/auth/signin');
    element(by.css('input[name=username]')).sendKeys(loginKeys);
    element(by.css('input[name=password]')).sendKeys(passwordKeys);
    element(by.css('button[type=submit]')).click();
    browser.wait(EC.not(EC.urlContains('auth/signin')), 5 * 1000);
  },
  signout: () => {
    browser.get('/auth/signout');
  },
  showAccount: () => {
    const userMenu = element(by.css('.l-header__user'));
    userMenu.element(by.css('[data-toggle="co-user-menu"]')).click();
    userMenu.element(by.cssContainingText('.m-link', 'Account')).click();
    userMenu.element(by.css('[data-toggle="co-user-menu"]')).click();
    browser.wait(EC.urlContains('settings/account'), 5 * 1000);
  },
};
