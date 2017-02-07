import React, { PropTypes } from 'react';
import Button from '../../../../components/Button';

const VerifyDevice = ({ device, onVerifyDevice, onDeleteDevice, __ }) => {
  const handleVerify = () => {
    onVerifyDevice({ device });
  };
  const handleDelete = () => {
    onDeleteDevice({ device });
  };

  return (
    <div className="m-device__verify">
      <Button
        plain
        className="m-device__verify-button"
        onClick={handleVerify}
      >{__('device.action.verify')}</Button>
      <br />
      {__('device.verify.not-you')}
      {' '}
      <Button onClick={handleDelete}>{__('device.action.delete')}</Button>
    </div>
  );
};

VerifyDevice.propTypes = {
  device: PropTypes.shape({}),
  onDeleteDevice: PropTypes.func.isRequired,
  onVerifyDevice: PropTypes.func.isRequired,
  __: PropTypes.func.isRequired,
};

export default VerifyDevice;
