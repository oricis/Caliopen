describe('Home', () => {
  // disabled since API is mocked
  xdescribe('Authentication', () => {
    afterEach(() => {
      browser.restart();
    });

    it('Log In', () => {
      // userUtil.login();
      browser.get('/');
      expect(element(by.css('tab-list')).getText()).toContain('Discussions');
    });

    it('Requires authentication', () => {
      browser.ignoreSynchronization = true;
      browser.get('http://localhost:4000');
      expect(element(by.css('.cor-login')).getText()).toContain('Sign In');
      browser.get('/');
      expect(element(by.css('.cor-login')).getText()).toContain('Sign In');
      browser.ignoreSynchronization = false;
    });

    it('Log out', () => {
      // userUtil.login();
      expect(element(by.xpath('//tab-list')).getText()).toContain('Discussions');
      browser.ignoreSynchronization = true;
      element(by.xpath('//co-layout-user-menu//a[@aria-label="Account"]')).click();
      element(by.xpath('//co-layout-user-menu//a[contains(string(), "Log Out")]')).click();
      expect(element(by.css('.cor-login')).getText()).toContain('Sign In');
    });
  });
});
