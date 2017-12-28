import React from 'react';
import PropTypes from 'prop-types';
import Section from '../../components/Section';
import PiBar from '../../components/PiBar/presenter';
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
      title={i18n._('device.manage.title')}
      descr={i18n._('device.manage.descr')}
    >
      <DeviceForm device={device} />
    </Section>

    <Section title={i18n._('device.info.title')}>
      <DeviceInformation device={device} />
    </Section>

    <Section
      title={i18n._('device.revoke.title')}
      descr={i18n._('device.revoke.descr')}
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
