import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';

const VerifyDevice = ({ device, onVerifyDevice, onDeleteDevice, __ }) => {
  const handleVerify = () => {
    onVerifyDevice({ device });
  };
  const handleDelete = () => {
    onDeleteDevice({ device });
  };

  return (
    <div className="m-device-verify">
      <Button
        plain
        className="m-device-verify__button"
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
  device: PropTypes.shape({}).isRequired,
  onDeleteDevice: PropTypes.func.isRequired,
  onVerifyDevice: PropTypes.func.isRequired,
  __: PropTypes.func.isRequired,
};

export default VerifyDevice;
