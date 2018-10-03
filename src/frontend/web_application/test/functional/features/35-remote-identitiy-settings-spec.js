const userUtil = require('../utils/user-util');

describe('Remote Identity Settings', () => {
  const EC = protractor.ExpectedConditions;

  beforeAll(async () => {
    await userUtil.signin();
  });

  it('CRUD', async () => {
    await userUtil.showSettings('External accounts');
    await browser.wait(EC.presenceOf($('.l-settings')), 5 * 1000);
    debugger;
    await element(by.cssContainingText('.m-button', 'Continue')).click();
    await element(by.css('input[name=identifier]')).sendKeys('foobar');
    await element(by.cssContainingText('.m-button', 'Next')).click();
    await element(by.css('input[name=inserverHostname]')).sendKeys('foobar.bar');
    await element(by.css('input[name=inserverPort]')).sendKeys('993');
    await element(by.cssContainingText('.m-button', 'Next')).click();
    await element(by.css('input[name=inusername]')).sendKeys('foo');
    await element(by.css('input[name=inpassword]')).sendKeys('secret');
    await element(by.cssContainingText('.m-button', 'Connect')).click();
    await browser.wait(EC.presenceOf(element(by.cssContainingText('.m-title__text', 'foobar'))), 5 * 1000);

    debugger;
    await element(by.cssContainingText('.m-button', 'Edit')).click();
    expect(element(by.css('input[name=identifier]')).getAttribute('disabled')).toEqual('true');
    await element(by.cssContainingText('.m-button', 'Next')).click();
    await element(by.css('input[name=inserverHostname]')).sendKeys(' edit');
    await element(by.cssContainingText('.m-button', 'Save')).click();
    await browser.wait(EC.presenceOf(element(by.cssContainingText('.m-title__text', 'foobar'))), 5 * 1000);
    expect(element(by.css('input[name=identifier]')).isPresent()).toBe(false);

    await element(by.cssContainingText('.m-button', 'Delete')).click();
    await element(by.cssContainingText('.m-button', 'Yes I\'m sure')).click();
    await browser.wait(EC.stalenessOf(element(by.cssContainingText('.m-title__text', 'foobar'))), 5 * 1000);
  });
});
