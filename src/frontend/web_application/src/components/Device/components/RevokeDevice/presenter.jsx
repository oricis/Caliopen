import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Button } from '../../../../components/';

const RevokeDevice = ({ device, onRevokeDevice }) => {
  const handleRevoke = () => {
    onRevokeDevice({ device });
  };

  return (
    <div className="m-device-revoke">
      <Button
        className="m-device-revoke__button"
        shape="plain"
        color="alert"
        onClick={handleRevoke}
      ><Trans id="device.action.revoke">Revoke this device</Trans></Button>
    </div>
  );
};

RevokeDevice.propTypes = {
  device: PropTypes.shape({}).isRequired,
  onRevokeDevice: PropTypes.func.isRequired,
};

export default RevokeDevice;
