import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { Section } from '../../../../components';
import DeviceForm from '../DeviceForm';
import DeviceInformation from '../DeviceInformation';
import VerifyDevice from '../VerifyDevice';
import RevokeDevice from '../RevokeDevice';

class DeviceSettings extends Component {
  static propTypes = {
    isLastVerifiedDevice: PropTypes.bool,
    isCurrentDevice: PropTypes.bool,
    isCurrentDeviceVerified: PropTypes.bool,
    device: PropTypes.shape({}),
  };

  static defaultProps = {
    isLastVerifiedDevice: undefined,
    isCurrentDevice: undefined,
    isCurrentDeviceVerified: undefined,
    device: null,
  };

  renderRevokeButton() {
    const {
      device, isCurrentDevice, isLastVerifiedDevice, isCurrentDeviceVerified,
    } = this.props;

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
    const { device, isCurrentDevice } = this.props;

    return (
      <Fragment>
        <DeviceInformation device={device} isCurrentDevice={isCurrentDevice} />
        <DeviceForm device={device} />
        {this.renderRevokeButton()}
      </Fragment>
    );
  }

  renderVerifyDevice() {
    const { device, isCurrentDevice } = this.props;

    return (
      <Fragment>
        <DeviceInformation device={device} isCurrentDevice={isCurrentDevice} />
        <VerifyDevice device={device} />
      </Fragment>
    );
  }

  renderDevice() {
    const { device } = this.props;

    // FIXME: verify device should be displayed on a verified device or ...
    return device.signature_key === null ?
      this.renderVerifyDevice(device) :
      this.renderForm(device);
  }

  render() {
    // TODO: set context according to security level
    const borderContext = 'disabled';

    return (
      <Section borderContext={borderContext}>
        {this.renderDevice()}
      </Section>
    );
  }
}

export default DeviceSettings;
