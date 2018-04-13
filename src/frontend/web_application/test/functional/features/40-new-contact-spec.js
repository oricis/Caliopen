const userUtil = require('../utils/user-util');
const { home } = require('../utils/navigation');

describe('Create new contact', () => {
  const EC = protractor.ExpectedConditions;

  beforeAll(async () => {
    await userUtil.signin();
  });

  beforeEach(async () => {
    await home();
  });

  it('Creates a new contact', async () => {
    const createButtonSelector = by.cssContainingText('.m-call-to-action__btn', 'Create a contact');
    const name = 'Foobar';

    // XXX: click .btn--principal to force :hover callback actions
    await element(by.css('.m-call-to-action__btn--principal')).click();
    await element(createButtonSelector).click();
    await browser.wait(EC.presenceOf($('.s-contact .m-contact-profile-form')), 1000);
    await element(by.css('.m-contact-profile-form__input input[name="given_name"]')).sendKeys(name);
    await element(by.cssContainingText('.s-contact__action', 'Validate')).click();
    await browser.wait(EC.presenceOf($('.s-contact .m-contact-profile')), 1000);
    expect(element(by.css('.m-contact-profile__name')).getText()).toEqual(name);
  });
});
