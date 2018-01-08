const userUtil = require('../utils/user-util');

describe('tag', () => {
  const EC = protractor.ExpectedConditions;
  const locale = 'en';
  const __ = key => ({
    en: {},
  }[locale][key] || key);

  beforeEach(() => {
    userUtil.signin();
  });

  it('manage tags on timeline', () => {
    const tagName = 'Mon tag';
    browser.wait(EC.presenceOf($('.s-timeline .s-message-item')), 5 * 1000)
      .then(() => {
        const messageElement = element(by.cssContainingText(
          '.m-message-item-container',
          'zoidberg (zoidberg@planet-express.tld)'
        ));

        return browser.actions().mouseMove(messageElement).perform()
          .then(() => messageElement.element(by.cssContainingText('.m-message-item-container__action', __('Manage tags'))).click())
          .then(() => expect(element(by.cssContainingText('.m-modal', __('Tags'))).isPresent()).toEqual(true));
      })
      .then(() => browser.element(by.css('.m-tags-form .m-input-text')).sendKeys('in'))
      .then(() => browser.element(by.cssContainingText('.m-tags-form__found-tag', __('INBOX'))).click())
      .then(() => browser.wait(EC.presenceOf(element(by.cssContainingText('.m-tags-form__section .m-tag', __('INBOX')))), 5 * 1000))
      .then(() => browser.element(by.css('.m-tags-form .m-input-text')).sendKeys(tagName))
      .then(() => browser.element(by.css(`.m-tags-search__button[aria-label=${__('Add')}]`)).click())
      .then(() => browser.wait(EC.presenceOf(element(by.cssContainingText('.m-tags-form__section .m-tag', tagName))), 5 * 1000))
      .then(() => element(by.cssContainingText('.m-tags-form__section .m-tag', __('INBOX'))).element(by.css(`[aria-label="${__('Remove')}"]`)).click())
      .then(() => expect(element(by.cssContainingText('.m-tags-form__section .m-tag', __('INBOX'))).isPresent()).toEqual(false))
      .then(() => element(by.cssContainingText('.m-tags-form__section .m-tag', tagName)).element(by.css(`[aria-label="${__('Remove')}"]`)).click())
      .then(() => expect(element(by.cssContainingText('.m-tags-form__section .m-tag', tagName)).isPresent()).toEqual(false))
    ;
  });
});
