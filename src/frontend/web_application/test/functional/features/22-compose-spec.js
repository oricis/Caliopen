const userUtil = require('../utils/user-util');

describe('Compose new message', () => {
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    userUtil.signin();
  });

  describe('Save a draft and send', () => {
    it('composes a new message with no recipients', () => {
      const text1 = 'new message with no rcpts ';

      const writeButtonSelector = by.cssContainingText('.m-call-to-action__btn--principal', 'Compose');

      browser.get('/')
        .then(() => element(writeButtonSelector).click())
        .then(() => browser.wait(EC.presenceOf($('.m-new-draft')), 1000))
        .then(() =>
          expect(element(by.cssContainingText('.m-navbar-item', 'Compose')).isPresent())
            .toEqual(true)
        )
        .then(() => {
          console.log('write msg');
          const draftBodyElement1 = element(by.css('.m-discussion-textarea__body'));
          draftBodyElement1.sendKeys(text1);
        })
        .then(() => element(by.cssContainingText('button', 'Save')).click())
        .then(() => browser.wait(EC.presenceOf($('.m-discussion-textarea__body')), 3 * 1000))
        .then(() =>
          expect(element(by.cssContainingText('.m-navbar-item', 'Compose')).isPresent())
            .toBe(false)
        )
        .then(() => expect(element(by.cssContainingText('.m-navbar-item', text1)).isPresent())
          .toBe(true)
        )
        .then(
          () => element.all(by.css('.m-discussion-textarea__body .m-recipient-list__recipient'))
            .then(items => expect(items.length).toEqual(0), (err) => { throw err; })
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

    it('composes a new message with a known recipient', () => {
      const text1 = 'new message for a known recipient';

      const writeButtonSelector = by.cssContainingText('.m-call-to-action__btn--principal', 'Compose');

      browser.get('/')
        .then(() => element(writeButtonSelector).click())
        .then(() => browser.wait(EC.presenceOf($('.m-new-draft')), 1000))
        .then(() => {
          console.log('search recipient');
          const searchInputElement = element(by.css('.m-recipient-list__search-input'));
          searchInputElement.sendKeys('ben');

          return element.all(by.css('.m-recipient-list__search-result'))
            .then(results => results[0].click());
        })
        .then(() => {
          console.log('write msg');
          const draftBodyElement1 = element(by.css('.m-discussion-textarea__body'));
          draftBodyElement1.sendKeys(text1);
        })
        .then(() => element(by.cssContainingText('button', 'Save')).click())
        .then(() => browser.wait(EC.presenceOf($('.m-discussion-textarea__body')), 3 * 1000))
        .then(
          () => element.all(by.css('.m-recipient-list__recipient'))
            .then((items) => {
              expect(items.length).toEqual(1);

              return items;
            }, (err) => {
              throw err;
            })
            .then(items => expect(items[0].getText()).toContain('bender@caliopen.local'))
        )
      ;
    });
  });

  describe('recipient search results manipulation', () => {
    it('has no suggestions for an already selected recipient', () => {
      const writeButtonSelector = by.cssContainingText('.m-call-to-action__btn--principal', 'Compose');

      browser.get('/')
        .then(() => element(writeButtonSelector).click())
        .then(() => browser.wait(EC.presenceOf($('.m-new-draft')), 1000))
        .then(() => {
          console.log('search recipient');
          const searchInputElement = element(by.css('.m-recipient-list__search-input'));
          searchInputElement.sendKeys('be');

          const benderResultElement = element(by.cssContainingText('.m-recipient-list__search-result', 'bender@caliopen.local'));

          return benderResultElement.click();
        })
        .then(() => {
          const searchInputElement = element(by.css('.m-recipient-list__search-input'));
          searchInputElement.sendKeys('be');

          return element.all(by.css('.m-recipient-list__search-result'))
            .then((results) => {
              expect(results.length).toEqual(2);

              return results;
            });
        })
        .then(() => {
          const benderResultElement = element(by.cssContainingText('.m-recipient-list__search-result', 'bender@caliopen.local'));

          expect(benderResultElement.isPresent()).toEqual(false);
        })
        .then(
          () => element.all(by.css('.m-recipient-list__recipient'))
            .then((items) => {
              expect(items.length).toEqual(1);

              return items;
            }, (err) => {
              throw err;
            })
            .then(items => expect(items[0].getText()).toContain('bender@caliopen.local'))
        )
      ;
    });

    it('shows and hide rcpt search results', () => {
      const writeButtonSelector = by.cssContainingText('.m-call-to-action__btn--principal', 'Compose');
      const dropdownSelector = by.css('.m-recipient-list__search .m-dropdown');

      browser.get('/')
        .then(() => element(writeButtonSelector).click())
        .then(() => browser.wait(EC.presenceOf($('.m-new-draft')), 1000))
        .then(() => {
          console.log('search recipient');
          const searchInputElement = element(by.css('.m-recipient-list__search-input'));
          searchInputElement.sendKeys('be');
        })
        .then(() => expect(element(dropdownSelector).isDisplayed()).toEqual(true))
        .then(() => element(by.css('.m-recipient-list__search-input')).click())
        .then(() => expect(element(dropdownSelector).isDisplayed()).toEqual(true))
        .then(() => element(by.cssContainingText('.l-navigation__tab-list .m-navbar-item__content', 'Compose')).click())
        .then(() => expect(element(dropdownSelector).isDisplayed()).toEqual(false))
        .then(() => element(by.css('.m-recipient-list__search-input')).click())
        .then(() => expect(element(dropdownSelector).isDisplayed()).toEqual(true))
        .then(() => element(by.cssContainingText('.m-recipient-list__search-result', 'bender@caliopen.local')).click())
        .then(() => element(by.css('.m-recipient-list__search-input')).click())
        .then(() => expect(element(dropdownSelector).isDisplayed()).toEqual(false))
        .then(
          () => element.all(by.css('.m-recipient-list__recipient'))
            .then((items) => {
              expect(items.length).toEqual(1);

              return items;
            }, (err) => {
              throw err;
            })
            .then(items => expect(items[0].getText()).toContain('bender@caliopen.local'))
        )
      ;
    });

    it('can use keyboard arrows to select search result', () => {
      const writeButtonSelector = by.cssContainingText('.m-call-to-action__btn--principal', 'Compose');
      const searchResultItemsSelector = by.css('.m-recipient-list__search-result');

      browser.get('/')
        .then(() => element(writeButtonSelector).click())
        .then(() => browser.wait(EC.presenceOf($('.m-new-draft')), 1000))
        .then(() => {
          console.log('search recipient');
          const searchInputElement = element(by.css('.m-recipient-list__search-input'));
          searchInputElement.sendKeys('be');

          return searchInputElement;
        })
        .then(searchInputElement =>
          element.all(searchResultItemsSelector)
            .then(items => expect(items[0].getAttribute('class')).toContain('m-button--active'))
            .then(() => searchInputElement.sendKeys(protractor.Key.ARROW_DOWN))
            .then(() => element.all(searchResultItemsSelector))
            .then((items) => {
              expect(items[0].getAttribute('class')).not.toContain('m-button--active');
              expect(items[1].getAttribute('class')).toContain('m-button--active');
            })
            .then(() => searchInputElement.sendKeys(protractor.Key.ARROW_DOWN))
            .then(() => element.all(searchResultItemsSelector))
            .then((items) => {
              expect(items[2].getAttribute('class')).toContain('m-button--active');
            })
            .then(() => searchInputElement.sendKeys(protractor.Key.ARROW_UP, protractor.Key.ENTER))
        )
        .then(
          () => element.all(by.css('.m-recipient-list__recipient'))
            .then((items) => {
              expect(items.length).toEqual(1);

              return items;
            }, (err) => {
              throw err;
            })
            .then(items => expect(items[0].getText()).toContain('zoidberg@caliopen.local'))
        )
      ;
    });
  });
});
