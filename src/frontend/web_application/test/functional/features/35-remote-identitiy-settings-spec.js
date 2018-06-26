const userUtil = require('../utils/user-util');

describe('Remote Identity Settings', () => {
  const EC = protractor.ExpectedConditions;

  beforeAll(async () => {
    await userUtil.signin();
  });

  it('CRUD', async () => {
    await userUtil.showSettings('External accounts');
    await browser.wait(EC.presenceOf($('.l-settings')), 5 * 1000);
    await element(by.css('input[name=displayName]')).sendKeys('foobar');
    await element(by.cssContainingText('.m-button', 'Continue')).click();
    await element(by.cssContainingText('.m-button', 'Next')).click();
    await element(by.css('input[name=serverHostname]')).sendKeys('foobar.bar');
    await element(by.css('input[name=serverPort]')).sendKeys('993');
    await element(by.cssContainingText('.m-button', 'Next')).click();
    await element(by.css('input[name=username]')).sendKeys('foo');
    await element(by.css('input[name=password]')).sendKeys('secret');
    await element(by.cssContainingText('.m-button', 'Connect')).click();
    await browser.wait(EC.presenceOf(element(by.cssContainingText('.m-title__text', 'foobar'))), 5 * 1000);

    await element(by.cssContainingText('.m-button', 'Edit')).click();
    await element(by.css('input[name=displayName]')).sendKeys(' edit');
    await element(by.cssContainingText('.m-button', 'Save')).click();
    await browser.wait(EC.presenceOf(element(by.cssContainingText('.m-title__text', 'foobar edit'))), 5 * 1000);
    expect(element(by.css('input[name=displayName]')).toBePresent()).isEqual(false);

    await element(by.cssContainingText('.m-button', 'Delete')).click();
    await browser.wait(EC.stalenessOf(element(by.cssContainingText('.m-title__text', 'foobar edit'))), 5 * 1000);
  });
});
