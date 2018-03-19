const { signin } = require('../utils/user-util');
const { showSettings } = require('../utils/user-util');
const { clearKeypairInLocalStorage, restoreKeypairInLocalStorage } = require('../utils/window');

describe('device', () => {
  const EC = protractor.ExpectedConditions;

  it('redirect to device management on a new device for an existing account', () => {
    signin()
      .then(() => expect(browser.getCurrentUrl()).not.toContain('/settings/devices'))
      .then(() => clearKeypairInLocalStorage({ save: true }))
      .then(() => signin())
      .then(() => expect(browser.getCurrentUrl()).toContain('/settings/devices'))
      .then(() => restoreKeypairInLocalStorage())
      .then(() => signin())
      .then(() => expect(browser.getCurrentUrl()).not.toContain('/settings/devices'))
      // delete the created device
      .then(() => showSettings('Devices'))
      .then(() => element(by.cssContainingText('.m-device-settings', 'desktop 2')))
      .then(deviceBlock => deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).click())
      .then(() => browser.wait(EC.presenceOf(element(by.cssContainingText('.l-notification-center', 'The device has been revoked'))), 5 * 1000))
    ;
  });

  describe('revoke on a verified device', () => {
    beforeEach(() => {
      signin();
    });

    it('hides the button for the last verified device', () => {
      showSettings('Devices')
        .then(() => element(by.cssContainingText('.m-device-settings', 'default')))
        .then(deviceBlock => expect(
          deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent()
        ).toEqual(false))
      ;
    });

    it('revoke an other device', () => {
      showSettings('Devices')
        .then(() => expect(element.all(by.css('.m-device-settings')).count()).toEqual(2))
        .then(() => element(by.cssContainingText('.m-device-settings', 'device to revoke')))
        .then(deviceBlock => deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).click())
        .then(() => browser.wait(EC.presenceOf(element(by.cssContainingText('.l-notification-center', 'The device has been revoked'))), 5 * 1000))
        .then(() => expect(element.all(by.css('.m-device-settings')).count()).toEqual(1))
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
        .then(() => browser.wait(EC.presenceOf(element(by.css('.m-device-settings')), 5 * 1000)))
        .then(() => element.all(by.css('.m-device-settings')).count().then((nb) => {
          nbDevices = nb;
        }))
        .then(() => browser.pause())
        .then(() => element(by.cssContainingText('.m-device-settings', `desktop ${nbDevices - 2}`)))
        .then(deviceBlock => expect(deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent()).toEqual(false))
        .then(() => element(by.cssContainingText('.m-device-settings', `desktop ${nbDevices - 1}`)))
        .then(deviceBlock => expect(deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent()).toEqual(true))
        // clear created devices
        .then(() => restoreKeypairInLocalStorage())
        .then(() => signin())
        .then(() => showSettings('Devices'))

        .then(() => element(by.cssContainingText('.m-device-settings', `desktop ${nbDevices - 2}`)))
        .then(deviceBlock => deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).click())
        .then(() => element(by.cssContainingText('.m-device-settings', `desktop ${nbDevices - 1}`)))
        .then(deviceBlock => deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).click())
        .then(() => browser.wait(EC.presenceOf(element(by.cssContainingText('.l-notification-center', 'The device has been revoked'))), 5 * 1000))
      ;
    });

    it('revoke the device then redirect to signout', () => {
      let nbDevices;
      signin()
        .then(() => clearKeypairInLocalStorage({ save: true }))
        .then(() => signin())
        .then(() => element.all(by.css('.m-device-settings')).count().then((nb) => {
          nbDevices = nb;
        }))
        .then(() => element(by.cssContainingText('.m-device-settings', `desktop ${nbDevices - 1}`)))
        .then(deviceBlock => deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).click())
        .then(() => expect(browser.getCurrentUrl()).toContain('signin'))
        .then(() => restoreKeypairInLocalStorage())
      ;
    });
  });
});
