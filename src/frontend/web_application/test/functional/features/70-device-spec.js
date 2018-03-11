const { signin } = require('../utils/user-util');
const { showSettings } = require('../utils/user-util');
const { clearKeypairInLocalStorage, restoreKeypairInLocalStorage } = require('../utils/window');

describe('device', () => {
  const EC = protractor.ExpectedConditions;

  it('redirect to device management on a new device for an existing account', () => {
    signin()
      .then(() => expect(browser.getCurrentUrl()).not.toContain('/settings/devices/'))
      .then(() => clearKeypairInLocalStorage({ save: true }))
      .then(() => signin())
      .then(() => expect(browser.getCurrentUrl()).toContain('/settings/devices/'))
      .then(() => restoreKeypairInLocalStorage())
      .then(() => signin())
      .then(() => expect(browser.getCurrentUrl()).not.toContain('/settings/devices/'))
      // delete the created device
      .then(() => showSettings('Devices'))
      .then(() => element(by.cssContainingText('.s-devices-settings__nav-item', 'desktop 2')).click())
      .then(() => browser.wait(EC.presenceOf($('.m-device-settings')), 5 * 1000))
      .then(() => element(by.cssContainingText('.m-button', 'Revoke this device')).click())
      .then(() => browser.wait(EC.presenceOf($('.s-devices-settings')), 5 * 1000))
    ;
  });

  describe('revoke on a verified device', () => {
    beforeEach(() => {
      signin();
    });

    it('hides the button for the last verified device', () => {
      showSettings('Devices')
        .then(() => element(by.cssContainingText('.s-devices-settings__nav-item', 'default')).click())
        .then(() => browser.wait(EC.presenceOf($('.m-device-settings')), 5 * 1000))
        .then(() => expect(element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent()).toEqual(false))
      ;
    });

    it('revoke an other device then redirect to list', () => {
      showSettings('Devices')
        .then(() => expect(element.all(by.css('.s-devices-settings__nav-item')).count()).toEqual(2))
        .then(() => element(by.cssContainingText('.s-devices-settings__nav-item', 'device to revoke')).click())
        .then(() => browser.wait(EC.presenceOf($('.m-device-settings')), 5 * 1000))
        .then(() => element(by.cssContainingText('.m-button', 'Revoke this device')).click())
        .then(() => browser.wait(EC.presenceOf($('.s-devices-settings')), 5 * 1000))
        .then(() => expect(browser.getCurrentUrl()).toMatch(/\/settings\/devices$/))
        .then(() => expect(element.all(by.css('.s-devices-settings__nav-item')).count()).toEqual(1))
      ;
    });
  });

  describe('revoke on a unverified device', () => {
    it('hides the button except itself', () => {
      let nbDevices;

      signin() // create default
        .then(() => clearKeypairInLocalStorage({ save: true }))
        .then(() => signin())
        .then(() => clearKeypairInLocalStorage())
        .then(() => signin())
        .then(() => element.all(by.css('.s-devices-settings__nav-item')).count().then((nb) => {
          nbDevices = nb;
        }))
        .then(() => element(by.cssContainingText('.s-devices-settings__nav-item', `desktop ${nbDevices - 2}`)).click())
        .then(() => browser.wait(EC.presenceOf($('.m-device-settings')), 5 * 1000))
        .then(() => expect(element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent()).toEqual(false))
        // .then(() => browser.pause())
        .then(() => element(by.cssContainingText('.s-devices-settings__nav-item', `desktop ${nbDevices - 1}`)).click())
        .then(() => browser.wait(EC.presenceOf($('.m-device-settings')), 5 * 1000))
        .then(() => expect(element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent()).toEqual(true))
        // clear created devices
        .then(() => restoreKeypairInLocalStorage())
        .then(() => signin())
        .then(() => showSettings('Devices'))
        .then(() => element(by.cssContainingText('.s-devices-settings__nav-item', `desktop ${nbDevices - 2}`)).click())
        .then(() => browser.wait(EC.presenceOf($('.m-device-settings')), 5 * 1000))
        .then(() => element(by.cssContainingText('.m-button', 'Revoke this device')).click())
        .then(() => browser.wait(EC.presenceOf($('.s-devices-settings')), 5 * 1000))
        .then(() => element(by.cssContainingText('.s-devices-settings__nav-item', `desktop ${nbDevices - 1}`)).click())
        .then(() => browser.wait(EC.presenceOf($('.m-device-settings')), 5 * 1000))
        .then(() => element(by.cssContainingText('.m-button', 'Revoke this device')).click())
        .then(() => browser.wait(EC.presenceOf($('.s-devices-settings')), 5 * 1000))
      ;
    });

    it('revoke the device then redirect to signout', () => {
      let nbDevices;
      signin()
        .then(() => clearKeypairInLocalStorage({ save: true }))
        .then(() => signin())
        .then(() => element.all(by.css('.s-devices-settings__nav-item')).count().then((nb) => {
          nbDevices = nb;
        }))
        .then(() => element(by.cssContainingText('.s-devices-settings__nav-item', `desktop ${nbDevices - 1}`)).click())
        .then(() => browser.wait(EC.presenceOf($('.m-device-settings')), 5 * 1000))
        .then(() => element(by.cssContainingText('.m-button', 'Revoke this device')).click())
        .then(() => expect(browser.getCurrentUrl()).toContain('signin'))
        .then(() => restoreKeypairInLocalStorage())
      ;
    });
  });
});
