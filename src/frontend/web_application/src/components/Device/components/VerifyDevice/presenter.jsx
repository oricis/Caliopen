import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import Button from '../../../../components/Button';

const VerifyDevice = ({ device, onVerifyDevice, onDeleteDevice }) => {
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
      ><Trans id="device.action.verify">device.action.verify</Trans></Button>
      <br />
      <Trans id="device.verify.not-you">device.verify.not-you</Trans>
      {' '}
      <Button onClick={handleDelete}><Trans id="device.action.delete">device.action.delete</Trans></Button>
    </div>
  );
};

VerifyDevice.propTypes = {
  device: PropTypes.shape({}).isRequired,
  onDeleteDevice: PropTypes.func.isRequired,
  onVerifyDevice: PropTypes.func.isRequired,
};

export default VerifyDevice;
