const userUtil = require('../utils/user-util');

describe('Message list', () => {
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    userUtil.signin();
  });

  it('list', () => {
    browser.get('/')
      .then(() => browser.wait(EC.presenceOf($('.s-discussion-list__thread')), 5 * 1000))
      .then(() => element(by.cssContainingText(
        '.s-discussion-list__thread',
        'test@caliopen.local, john@caliopen.local, zoidberg@planet-express.tld'
      )).click())
      .then(() => browser.wait(EC.presenceOf($('.m-message-list')), 5 * 1000))
      .then(() => expect(element.all(by.css('.m-message')).count()).toEqual(2));
  });

  it('removes a message', () => {
    browser.get('/')
      .then(() => browser.wait(EC.presenceOf($('.s-discussion-list__thread')), 5 * 1000))
      .then(() => element(by.cssContainingText(
        '.s-discussion-list__thread',
        'removeme@caliopen.local, john@caliopen.local'
      )).click())
      .then(() => browser.wait(EC.presenceOf($('.m-message-list')), 5 * 1000))
      .then(() => expect(element.all(by.css('.m-message')).count()).toEqual(2))
      .then(() => {
        const topBar = element(by.cssContainingText('.m-message__top-bar', 'removeme@caliopen.local'));

        return topBar.element(by.css('.m-message__actions-switcher')).click()
          .then(() =>
            topBar.element(by.cssContainingText('.m-message-actions-container__action', 'Supprimer')
              .click())
          );
      })
      .then(() => expect(element.all(by.css('.m-message')).count()).toEqual(1))
      .then(() => {
        const topBar = element(by.cssContainingText('.m-message__top-bar', 'john@caliopen.local'));

        return topBar.element(by.css('.m-message__actions-switcher')).click()
          .then(() =>
            topBar.element(by.cssContainingText('.m-message-actions-container__action', 'Supprimer')
              .click())
          );
      })
      .then(() => browser.wait(EC.presenceOf($('.s-discussion-list__thread')), 5 * 1000))
    ;
  });

  it('removes all messages', () => {
    browser.get('/')
      .then(() => browser.wait(EC.presenceOf($('.s-discussion-list__thread')), 5 * 1000))
      .then(() => element(by.cssContainingText(
        '.s-discussion-list__thread',
        'removeall@caliopen.local, john@caliopen.local'
      )).click())
      .then(() => browser.wait(EC.presenceOf($('.m-message-list')), 5 * 1000))
      .then(() => expect(element.all(by.css('.m-message')).count()).toEqual(1))
      .then(() => element(by.cssContainingText('.m-message-list__action', 'Supprimer')).click())
      .then(() => browser.wait(EC.presenceOf($('.s-discussion-list__thread')), 5 * 1000))
    ;
  });
});
