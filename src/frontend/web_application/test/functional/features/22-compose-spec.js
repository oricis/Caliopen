const userUtil = require('../utils/user-util');

describe('Save a draft and send', () => {
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    userUtil.signin();
  });

  it('composes a new message', () => {
    const text1 = 'Eat my shinny ';

    const writeButtonSelector = by.cssContainingText('.m-call-to-action__btn--principal', 'Écrire');

    browser.get('/')
      .then(() => element(writeButtonSelector).click())
      .then(() => browser.wait(EC.presenceOf($('.m-new-draft')), 1000))
      .then(() =>
        expect(element(by.cssContainingText('.m-navbar-item', 'compose.route.label')).isPresent())
          .toEqual(true)
      )
      .then(() => {
        console.log('write msg');
        const draftBodyElement1 = element(by.css('.m-discussion-textarea__body'));
        draftBodyElement1.sendKeys(text1);

        return element(by.cssContainingText('button', 'Sauvegarder')).click();
      })
      .then(() => browser.wait(EC.presenceOf($('.m-discussion-textarea__body')), 3 * 1000))
      .then(() =>
        expect(element(by.cssContainingText('.m-navbar-item', 'compose.route.label')).isPresent())
          .toBe(false)
      )
      .then(() => expect(element(by.cssContainingText('.m-navbar-item', text1)).isPresent())
        .toBe(true)
      )
      .then(() => {
        const draftBodyElement1 = element(by.css('.m-discussion-textarea__body'));
        expect(draftBodyElement1.getText()).toEqual(text1);
      })
      .then(() => element(by.cssContainingText('.m-navbar-item__content', 'Discussions')).click())
      .then(() => browser.wait(EC.presenceOf($('.s-discussion-list__thread')), 3 * 1000))
      .then(() => expect(
        element.all(by.cssContainingText('.s-discussion-list__col-title', text1)).count()
      ).toEqual(1))
    ;
  });
});
