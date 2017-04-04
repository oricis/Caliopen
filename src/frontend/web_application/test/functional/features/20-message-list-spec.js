const userUtil = require('../utils/user-util');

describe('Message list', () => {
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    userUtil.signin();
  });

  it('list', () => {
    browser.get('/');
    element(by.cssContainingText(
      '.s-discussion-list__thread',
      'test@caliopen.local, zoidberg@caliopen.local'
    )).click();

    browser.wait(EC.presenceOf($('.m-message-list')), 5 * 1000);
    expect(element.all(by.css('.m-message')).count()).toEqual(2);
  });
});
