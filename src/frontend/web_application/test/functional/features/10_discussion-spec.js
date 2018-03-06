const userUtil = require('../utils/user-util');
const { home } = require('../utils/navigation');

describe('Discussions', () => {
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    userUtil.signin();
  });

  it('list', () => {
    home()
      .then(() => {
        expect(element(by.css('.m-application-switcher .m-navbar-item__content')).getText()).toContain('MESSAGES');
      })
      .then(() => browser.wait(EC.presenceOf($('.s-timeline .s-message-item')), 5 * 1000))
      .then(() => {
        expect(element.all(by.css('.s-timeline .s-message-item .s-message-item__topic .s-message-item__excerpt')).first().getText())
          .toContain('Fry! Stay back! He\'s too powerful!');
        expect(element.all(by.css('.s-message-item')).count()).toEqual(7);
        expect(
          element(by.cssContainingText('.s-timeline__load-more', 'Load more')).isPresent()
        ).toBe(false);
      });
  });

  describe('thread', () => {
    it('render and listed contacts describe the thread', () => {
      home()
        .then(() => browser.wait(EC.presenceOf($('.s-timeline .s-message-item')), 5 * 1000))
        .then(() => element(by.cssContainingText(
          '.s-message-item .s-message-item__topic .s-message-item__excerpt',
          'Fry! Stay back! He\'s too powerful!'
        )).click());
      // TODO tabs
      // expect(element(by.css('.m-tab.m-navbar__item--is-active .m-tab__link')).getText())
      //   .toContain('zoidberg, john');
    });
  });
});
