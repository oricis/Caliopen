// TODO: not verified because not used yet
module.exports = {
  switch: application => element(by.css('.m-application-switcher__toggler')).click()
      .then(() => element(by.cssContainingText('.m-application-switcher__dropdown .m-link', application)).click()),
};
