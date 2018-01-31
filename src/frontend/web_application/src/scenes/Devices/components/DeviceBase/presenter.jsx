import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '../../../../components/';
import PiBar from '../../../../components/PiBar/presenter';
import DeviceForm from './components/DeviceForm';
import DeviceInformation from './components/DeviceInformation';
import VerifyDevice from './components/VerifyDevice';
import RevokeDevice from './components/RevokeDevice';

import './style.scss';

const renderForm = (device, i18n) => (
  <div>
    <Section className="m-device__pi">
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
      <RevokeDevice device={device} />
    </Section>
  </div>
);

const renderVerifyDevice = (device, i18n) => (
  <Section
    title={i18n._('device.verify.title')}
    descr={i18n._('device.verify.descr')}
    hasSeparator={false}
  >
    <DeviceInformation device={device} />
    <VerifyDevice device={device} />
  </Section>
);

const Device = ({ device, i18n }) => (
  <div className="m-device">
    {device.signature_key === null ?
      renderVerifyDevice(device, i18n) :
      renderForm(device, i18n)
    }
  </div>
);

Device.propTypes = {
  device: PropTypes.shape({}).isRequired,
  i18n: PropTypes.shape({}).isRequired,
};

export default Device;
