const userUtil = require('../utils/user-util');

describe('Account', () => {
  const EC = protractor.ExpectedConditions;

  beforeAll(async () => {
    await userUtil.signin();
  });

  beforeEach(async () => {
    await userUtil.showAccount();
  });

  it('Change password', async () => {
    await element(by.cssContainingText('.l-user .m-nav-list a', 'Security')).click();
    await browser.wait(EC.presenceOf(element(by.css('.m-password-details'))), 5 * 1000);

    await element(by.cssContainingText('.m-password-details__action .m-button', 'Change')).click();
    await element(by.cssContainingText('.m-text-field-group', 'Current password:'))
      .element(by.css('.m-input-text')).sendKeys('Foo');
    await element(by.cssContainingText('.m-text-field-group', 'New password:'))
      .element(by.css('.m-input-text')).sendKeys('Bar');
    await element(by.cssContainingText('.m-text-field-group', 'New password confirmation:'))
      .element(by.css('.m-input-text')).sendKeys('Bar');
    await element(by.cssContainingText('.m-button', 'Apply modifications')).click();
    await browser.wait(EC.presenceOf(element(by.cssContainingText('.m-password-details', 'Password strength:'))), 5 * 1000);
  });
});
