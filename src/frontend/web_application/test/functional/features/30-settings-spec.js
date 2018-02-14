const userUtil = require('../utils/user-util');

describe('Settings', () => {
  const EC = protractor.ExpectedConditions;
  const locale = 'en';
  const __ = key => ({
    fr: {
      custom: 'Personnalisez votre interface',
      save: 'Enregistrer les paramètres',
    },
    en: {
      custom: 'Customize your interface',
      save: 'Save settings',
    },
  }[locale][key]);

  beforeEach(() => {
    userUtil.signin();
  });

  it('display form', () => {
    browser.get('/settings/application')
      .then(() => browser.wait(EC.presenceOf($('.l-settings')), 5 * 1000))
      .then(() => expect(element.all(by.css('.m-section__title')).first().getText()).toEqual(__('custom')))
      .then(() => expect(element(by.cssContainingText('.m-button', __('save'))).isPresent()).toBe(true))
    ;
  });
});
