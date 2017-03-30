// TODO: not verified because not used yet
module.exports = {
  switch: (application) => {
    const appSwitcherElement = element(by.css('.m-application-switcher'));

    const currentAppElement = appSwitcherElement.element(by.cssContainingText('.m-link', application));

    if (currentAppElement) {
      currentAppElement.click();

      return;
    }

    appSwitcherElement
      .element(by.css('a[data-toggle="co-application-switcher"]'))
      .click();
    appSwitcherElement
      .element(by.cssContainingText('.m-application-switcher__dropdown .m-link', application))
      .click();
  },
};
