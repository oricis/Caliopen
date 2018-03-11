import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Spinner, Section } from '../../../../components';
import PiBar from '../../../../components/PiBar';
import DeviceForm from '../DeviceForm';
import DeviceInformation from '../DeviceInformation';
import VerifyDevice from '../VerifyDevice';
import RevokeDevice from '../RevokeDevice';
import './style.scss';

class DeviceSettings extends Component {
  static propTypes = {
    isLastVerifiedDevice: PropTypes.bool,
    isCurrentDevice: PropTypes.bool,
    isCurrentDeviceVerified: PropTypes.bool,
    device: PropTypes.shape({}),
    isFetching: PropTypes.bool,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    isLastVerifiedDevice: undefined,
    isCurrentDevice: undefined,
    isCurrentDeviceVerified: undefined,
    device: null,
    isFetching: false,
  };

  renderRevokeButton() {
    const { device, isCurrentDevice, isLastVerifiedDevice, isCurrentDeviceVerified } = this.props;

    if (isLastVerifiedDevice === undefined) {
      return null;
    }

    if (isLastVerifiedDevice) {
      return (<Trans id="device.info.last_verified_device">The last verified device can not be revoked.</Trans>);
    }

    if (isCurrentDeviceVerified || isCurrentDevice) {
      return (<RevokeDevice device={device} />);
    }

    return (<Trans id="device.info.other_device">You need a verified device to revoke this one.</Trans>);
  }

  renderForm() {
    const { device, i18n } = this.props;

    return (
      <div>
        <Section className="m-device-settings__pi">
          <PiBar level={device.pi} />
        </Section>

        <Section
          title={i18n._('device.manage.title', { defaults: 'Manage Your device' })}
          descr={i18n._('device.manage.descr', { defaults: 'Here you can manage your device allowed to connect to your Caliopen account, set restrictions on some IP addresses and custom the name of your device to better identify it later.' })}
        >
          <DeviceForm device={device} />
        </Section>

        <Section title={i18n._('device.info.title', { defaults: 'Device informations' })}>
          <DeviceInformation device={device} />
        </Section>

        <Section
          title={i18n._('device.revoke.title', { defaults: 'Revoke this device' })}
          descr={i18n._('device.revoke.descr', { defaults: 'Please be careful about this section! This operation will delete this device which will be unable to access to your Caliopen account in the future.' })}
          hasSeparator={false}
        >
          {this.renderRevokeButton()}
        </Section>
      </div>
    );
  }

  renderVerifyDevice() {
    const { device, i18n } = this.props;

    return (
      <Section
        title={i18n._('device.verify.title')}
        descr={i18n._('device.verify.descr')}
        hasSeparator={false}
      >
        <DeviceInformation device={device} />
        <VerifyDevice device={device} />
      </Section>
    );
  }

  renderDevice() {
    const { device, i18n } = this.props;

    return device.signature_key === null ?
      this.renderVerifyDevice(device, i18n) :
      this.renderForm(device, i18n);
  }

  render() {
    const { device, isFetching } = this.props;

    return (
      <div className="m-device-settings">
        {isFetching && <Spinner isLoading />}
        {device && this.renderDevice()}
      </div>
    );
  }
}

export default DeviceSettings;
