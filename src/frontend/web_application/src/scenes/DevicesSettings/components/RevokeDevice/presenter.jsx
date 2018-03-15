import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Button, Icon } from '../../../../components';
import './style.scss';

class RevokeDevice extends Component {
  static propTypes = {
    device: PropTypes.shape({}).isRequired,
    revokeDevice: PropTypes.func.isRequired,
    clientDevice: PropTypes.shape({}),
    notifyError: PropTypes.func.isRequired,
    notifySuccess: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  };

  static defaultProps = {
    clientDevice: undefined,
  };

  handleRevoke = async () => {
    const { device, revokeDevice, notifySuccess, push, notifyError, clientDevice } = this.props;

    try {
      await revokeDevice({ device });
      notifySuccess({ message: (<Trans id="device.feedback.revoke_success">The device has been revoked</Trans>) });
      if (device.device_id === clientDevice.device_id) {
        push('/auth/signout');

        return;
      }
      push('/settings/devices');
    } catch ({ message }) {
      notifyError({ message });
    }
  };

  render() {
    return (
      <div className="m-device-revoke">
        <span className="m-device-revoke__info">
          <Trans id="device.revoke_info">Vous pouvez interdire à cet appareil de se connecter à votre compte à l avenir.</Trans>
        </span>
        <Button
          className="m-device-revoke__button"
          shape="plain"
          color="alert"
          onClick={this.handleRevoke}
        ><Icon type="remove" rightSpaced /><Trans id="device.action.revoke">Revoke this device</Trans></Button>
      </div>
    );
  }
}

export default RevokeDevice;
