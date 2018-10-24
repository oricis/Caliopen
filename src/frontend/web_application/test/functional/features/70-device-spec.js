const { signin } = require('../utils/user-util');
const { showSettings } = require('../utils/user-util');
const { clearKeypairInLocalStorage, restoreKeypairInLocalStorage } = require('../utils/window');

describe('Device', () => {
  const EC = protractor.ExpectedConditions;

  it('Redirect to device management on a new device for an existing account', async () => {
    await signin();
    await expect(browser.getCurrentUrl()).not.toContain('/settings/new-device');
    await clearKeypairInLocalStorage({ save: true });
    await signin();
    await expect(browser.getCurrentUrl()).toContain('/settings/new-device');
    await restoreKeypairInLocalStorage();
    await signin();
    await expect(browser.getCurrentUrl()).not.toContain('/settings/new-device');
    // delete the created device
    await showSettings('Devices');
    const deviceBlock = element(by.cssContainingText('.s-devices-settings__device', 'desktop 2'));
    await deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).click();
    await browser.wait(EC.presenceOf(element(by.cssContainingText('.l-notification-center', 'The device has been revoked'))), 5 * 1000);
  });

  describe('Revoke on a verified device', () => {
    beforeEach(async () => {
      await signin();
    });

    it('Hides the button for the last verified device', async () => {
      await showSettings('Devices');
      const deviceBlock = element(by.cssContainingText('.s-devices-settings__device', 'default'));
      expect(deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent())
        .toEqual(false);
    });

    it('Revoke an other device', async () => {
      await showSettings('Devices');
      await expect(element.all(by.css('.s-devices-settings__device')).count()).toEqual(2);
      const deviceBlock = element(by.cssContainingText('.s-devices-settings__device', 'device to revoke'));
      await deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.l-notification-center', 'The device has been revoked'))), 5 * 1000);
      expect(element.all(by.css('.s-devices-settings__device')).count()).toEqual(1);
    });
  });

  describe('Revoke on a unverified device', () => {
    it('Hides the button except itself', async () => {
      debugger;
      await signin(); // create default
      await clearKeypairInLocalStorage({ save: true });
      await signin();
      await clearKeypairInLocalStorage();
      await signin();
      await browser.wait(EC.presenceOf(element(by.css('.s-new-device-info')), 5 * 1000));
      await element(by.cssContainingText('.m-link', 'I understand')).click();
      await browser.wait(EC.presenceOf(element(by.css('.s-devices-settings__device')), 5 * 1000));
      const nbDevices = await element.all(by.css('.s-devices-settings__device')).count();
      const deviceBlock = element(by.cssContainingText('.s-devices-settings__device', `desktop ${nbDevices - 2}`));
      expect(deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent()).toEqual(false);
      const deviceBlock2 = element(by.cssContainingText('.s-devices-settings__device', `desktop ${nbDevices - 1}`));
      expect(deviceBlock2.element(by.cssContainingText('.m-button', 'Revoke this device')).isPresent()).toEqual(true);
      // clear created devices
      await restoreKeypairInLocalStorage();
      await signin();
      await showSettings('Devices');
      const deviceBlock3 = element(by.cssContainingText('.s-devices-settings__device', `desktop ${nbDevices - 2}`));
      await deviceBlock3.element(by.cssContainingText('.m-button', 'Revoke this device')).click();
      const deviceBlock4 = element(by.cssContainingText('.s-devices-settings__device', `desktop ${nbDevices - 1}`));
      await deviceBlock4.element(by.cssContainingText('.m-button', 'Revoke this device')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.l-notification-center', 'The device has been revoked'))), 5 * 1000);
    });

    it('Revoke the device then redirect to signout', async () => {
      await signin();
      await clearKeypairInLocalStorage({ save: true });
      await signin();
      await browser.wait(EC.presenceOf(element(by.css('.s-new-device-info')), 5 * 1000));
      await element(by.cssContainingText('.m-link', 'I understand')).click();
      const nbDevices = await element.all(by.css('.s-devices-settings__device')).count();
      const deviceBlock = element(by.cssContainingText('.s-devices-settings__device', `desktop ${nbDevices - 1}`));
      await deviceBlock.element(by.cssContainingText('.m-button', 'Revoke this device')).click();
      expect(browser.getCurrentUrl()).toContain('signin');
      await restoreKeypairInLocalStorage();
    });
  });
});
