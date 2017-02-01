import React, { PropTypes } from 'react';
import Title from '../../../../../../components/Title';
import Icon from '../../../../../../components/Icon';
import Button from '../../../../../../components/Button';
import PiBar from '../../../../../../components/PiBar';

import { FormGrid, FormRow, FormColumn, TextFieldGroup, SelectFieldGroup } from '../../../../../../components/form';

import './style.scss';

const deviceTypes = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'tablet', label: 'Tablet' },
];

const DisplayDevice = ({ device }) => {
  const thisDevice = device;
  const thisDeviceIPs = Array.from(new Set(thisDevice.ips));

  return (
    <div className="m-device">
      <FormGrid className="m-device__form">
        <FormRow className="m-device__row">
          <PiBar level={thisDevice.pi ? thisDevice.pi : 0} className="m-device__pi" />
        </FormRow>
        <FormRow className="m-device__row m-device__row--separated m-device__title">
          <FormColumn>
            <Title>Manage your device</Title>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn bottomSpace size="medium">
            <TextFieldGroup
              label="Name"
              placeholder="Name"
              name="device-name"
              id="device-name"
              showLabelforSr
              key={thisDevice.name}
              defaultValue={thisDevice.name}
            />
          </FormColumn>
          <FormColumn bottomSpace size="medium" className="m-device__infotext">
            <label htmlFor="device-name">This is the name which allows you to identify your device everywhere.</label>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn size="medium">
            <SelectFieldGroup
              className="m-device__type"
              label="Type"
              name="device-type"
              id="device-type"
              showLabelforSr
              value={thisDevice.type}
              options={deviceTypes}
            />
          </FormColumn>
          <FormColumn size="medium" className="m-device__infotext">
            <label htmlFor="device-type">Select a type of device: Desktop, Laptop, Smartphone or Tablet.</label>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn bottomSpace size="medium">
            <div className="m-device__ips">
              <div className="m-device__ip">
                <TextFieldGroup
                  label="Add an IP"
                  placeholder="Add an IP"
                  name="device-ips"
                  defaultValue=""
                  className="m-device__ip-input"
                  showLabelforSr
                />
                <Button plain className="m-device__ip-button"><Icon type="plus" /></Button>
              </div>
              {thisDeviceIPs.map(ip =>
                <div className="m-device__ip" key={ip}>
                  <TextFieldGroup
                    label="Authorized IP"
                    name={ip}
                    defaultValue={ip}
                    className="m-device__ip-input"
                    showLabelforSr
                  />
                  <Button plain className="m-device__ip-button"><Icon type="remove" /></Button>
                </div>
              )}
            </div>
          </FormColumn>
          <FormColumn bottomSpace size="medium" className="m-device__infotext">
            <label htmlFor="device-ips">Restrict the access of your account to certain IP adresses for this device.<br />e.g., <strong>192.168.1.11</strong> or <strong>192.168.1.1/24</strong> or <strong>192.168.1.1-20</strong></label>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn bottomSpace size="medium" className="m-device__submit">
            <Button plain>Save device parameters</Button>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row m-device__row--separated m-device__title">
          <FormColumn>
            <Title>Device info</Title>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn size="medium">
            Last connexion: {thisDevice.last_seen}
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn size="medium">
            OS: {thisDevice.os}
          </FormColumn>
          <FormColumn size="medium">
            Version: {thisDevice.os_version}
          </FormColumn>
        </FormRow>
      </FormGrid>
      <FormGrid className="m-device__form">
        <FormRow className="m-device__row m-device__row--separated m-device__title">
          <FormColumn>
            <Title>Revoke this device</Title>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn bottomSpace className="m-device__submit">
            <div><p>Please be careful with this section!<br />
            This operation will delete this devices which will be unable to
            access your Caliopen account in the future.</p></div>
          </FormColumn>
          <FormColumn className="m-device__submit">
            <Button plain alert>Revoke</Button>
          </FormColumn>
        </FormRow>
      </FormGrid>
    </div>
  );
};


DisplayDevice.propTypes = {
  device: PropTypes.shape({}),
};

export default DisplayDevice;
