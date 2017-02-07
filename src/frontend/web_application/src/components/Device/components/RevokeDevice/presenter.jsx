import React, { PropTypes } from 'react';
import Button from '../../../../components/Button';

const RevokeDevice = ({ device, onRevokeDevice, __ }) => {
  const handleRevoke = () => {
    onRevokeDevice({ device });
  };

  return (
    <div className="m-device__revoke">
      <Button
        className="m-device__revoke-button"
        plain
        alert
        onClick={handleRevoke}
      >{__('device.action.revoke')}</Button>
    </div>
  );
};

RevokeDevice.propTypes = {
  device: PropTypes.shape({}),
  onRevokeDevice: PropTypes.func.isRequired,
  __: PropTypes.func.isRequired,
};

export default RevokeDevice;
