import React, { PropTypes } from 'react';
import Section from '../../components/Section';
import PiBar from '../../components/PiBar/presenter';
import DeviceForm from './components/DeviceForm';
import DeviceInformation from './components/DeviceInformation';
import VerifyDevice from './components/VerifyDevice';
import RevokeDevice from './components/RevokeDevice';

import './style.scss';

const renderForm = (device, __) => (
  <div>
    <Section className="m-device__pi">
      <PiBar level={device.pi} />
    </Section>

    <Section
      title={__('device.manage.title')}
      descr={__('device.manage.descr')}
    >
      <DeviceForm device={device} />
    </Section>

    <Section title={__('device.info.title')}>
      <DeviceInformation device={device} />
    </Section>

    <Section
      title={__('device.revoke.title')}
      descr={__('device.revoke.descr')}
      hasSeparator={false}
    >
      <RevokeDevice device={device} />
    </Section>
  </div>
);

const renderVerifyDevice = (device, __) => (
  <Section
    title={__('device.verify.title')}
    descr={__('device.verify.descr')}
    hasSeparator={false}
  >
    <DeviceInformation device={device} />
    <VerifyDevice device={device} />
  </Section>
);

const Device = ({ device, __ }) => (
  <div className="m-device">
    {device.signature_key === null ?
      renderVerifyDevice(device, __) :
      renderForm(device, __)
    }
  </div>
);

Device.propTypes = {
  device: PropTypes.shape({}),
  __: PropTypes.func,
};

export default Device;
