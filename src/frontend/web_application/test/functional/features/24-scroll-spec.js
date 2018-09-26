const userUtil = require('../utils/user-util');
const { home } = require('../utils/navigation');
const { filter } = require('../utils/timeline');

describe('Scroll on Timeline and Discussion', () => {
  const EC = protractor.ExpectedConditions;

  beforeAll(async () => {
    await userUtil.signin();
  });

  beforeEach(async () => {
    await home();
  });

  it('Reaches targets and goes back home', async () => {
    // await filter('All');
    await browser.wait(EC.presenceOf($('.s-timeline .s-discussion-item')), 5 * 1000);
    await element(by.cssContainingText(
      '.s-discussion-item__message_excerpt',
      'Rien du tout !'
    )).click();
    await browser.wait(EC.presenceOf($('.m-message')), 5 * 1000);
    const scrollYD = await browser.executeScript(() => window.scrollY);
    expect(scrollYD).toBeGreaterThan(0);

    await element(by.cssContainingText('#e39919d5-d1cb-4887-8a42-95755a79f8b9 button', 'Reply')).click();
    const scrollYR = await browser.executeScript(() => window.scrollY);
    expect(scrollYR).toBeGreaterThan(scrollYD);

    await element(by.cssContainingText('.m-application-switcher .m-navbar-item__content', 'Messages')).click();
    browser.wait(EC.presenceOf($('.m-application-switcher.m-navbar-item--is-active')), 2 * 1000);
    const scrollYH = await browser.executeScript(() => window.scrollY);
    expect(scrollYH).toBe(0);
  });
});
