const userUtil = require('../utils/user-util');

describe('Create new contact', () => {
  const EC = protractor.ExpectedConditions;
  const locale = 'en';
  const __ = key => ({
    fr: {
      'new contact': 'Créer un contact',
      save: 'Valider',
      compose: 'Écrire',
    },
    en: {
      'new contact': 'Create a contact',
      save: 'Validate',
      compose: 'Compose',
    },
  }[locale][key]);

  beforeEach(() => {
    userUtil.signin();
  });

  it('creates a new contact', () => {
    // const text1 = 'Compose creates a new draft';
    const createButtonSelector = by.cssContainingText('.m-call-to-action__btn', __('new contact'));
    const name = 'Foobar';

    browser.get('./')
      // XXX: click .btn--principal to force :hover callback actions
      .then(() => element(by.css('.m-call-to-action__btn--principal')).click())
      .then(() => element(createButtonSelector).click())
      .then(() => browser.wait(EC.presenceOf($('.s-contact .m-contact-profile-form')), 1000))
      .then(() => element(by.css('.m-contact-profile-form__input input[name="given_name"]')).sendKeys(name))
      .then(() => element(by.cssContainingText('.s-contact__action', __('save'))).click())
      .then(() => browser.wait(EC.presenceOf($('.s-contact .m-contact-profile')), 1000))
      .then(() => expect(element(by.css('.m-contact-profile__name')).getText()).toEqual(name))
      ;
  });
});
