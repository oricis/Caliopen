import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';

const RevokeDevice = ({ device, onRevokeDevice, __ }) => {
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
      >{__('device.action.revoke')}</Button>
    </div>
  );
};

RevokeDevice.propTypes = {
  device: PropTypes.shape({}).isRequired,
  onRevokeDevice: PropTypes.func.isRequired,
  __: PropTypes.func.isRequired,
};

export default RevokeDevice;
