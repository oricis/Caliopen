describe('Discussions', () => {
  const EC = protractor.ExpectedConditions;

  it('list', () => {
    browser.get('/');
    const appSwitcher = element(by.css('.m-application-switcher'));
    expect(appSwitcher.element(by.cssContainingText('.m-navbar-link', 'Discussions')).isPresent())
      .toBe(true);
    browser.wait(EC.presenceOf($('.s-discussion-list__thread')), 5 * 1000);
    expect(element.all(by.css('.s-discussion-list__thread')).first().getText())
      .toContain('test@caliopen.local, zoidberg@caliopen.local');
    expect(element.all(by.css('.s-discussion-list__thread')).count()).toEqual(2);
    // expect(element(by.cssContainingText('.s-discussion-list__load-more', 'Load more')).isPresent())
    //   .toBe(false);
  });

  describe('thread', () => {
    it('render and listed contacts describe the thread', () => {
      browser.get('/');
      browser.wait(EC.presenceOf($('.s-discussion-list__thread')), 5 * 1000);
      element(by.cssContainingText(
        '.s-discussion-list__thread',
        'test@caliopen.local, zoidberg@caliopen.local'
      )).click();
      // expect(element(by.css('.m-tab.m-navbar__item--is-active .m-tab__link')).getText())
      //   .toContain('test@caliopen.local, zoidberg@caliopen.local');
    });
  });
});
