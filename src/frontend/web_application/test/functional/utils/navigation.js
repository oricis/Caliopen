module.exports = {
  switchApp: application => element(by.css('.m-application-switcher__toggler')).click()
    .then(() => element(by.cssContainingText('.m-application-switcher__dropdown .m-link', application)).click()),
  home: () => element(by.css('.l-header__brand a')).click(),
};
