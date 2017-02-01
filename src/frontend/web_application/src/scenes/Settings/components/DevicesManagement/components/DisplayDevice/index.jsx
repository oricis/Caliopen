import React, { PropTypes } from 'react';
import Title from '../../../../../../components/Title';
import Button from '../../../../../../components/Button';
import PiBar from '../../../../../../components/PiBar';
import TextList, { ItemContent } from '../../../../../../components/TextList';

import { FormGrid, FormRow, FormColumn, TextFieldGroup, SelectFieldGroup } from '../../../../../../components/form';

import './style.scss';

const DisplayDevice = ({ device }) => {
  const thisDevice = device;
  const deviceIps = device.ips;

  return (
    <div className="m-device">
      <FormGrid className="m-device__form">
        <FormRow className="m-device__row">
          <PiBar level={thisDevice.pi} className="m-device__pi" />
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
              label="Type"
              name="device-name"
              id="device-type"
              showLabelforSr
              value={thisDevice.type}
              options={[{ value: 'desktop', label: 'Desktop' }, { value: 'laptop', label: 'Laptop' }, { value: 'smartphone', label: 'Smartphone' }, { value: 'tablet', label: 'Tablet' }]}
            />
          </FormColumn>
          <FormColumn size="medium" className="m-device__infotext">
            <label htmlFor="device-type">Select a type of device: Desktop, Laptop, Smartphone or Tablet.</label>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn bottomSpace size="medium">
            <TextFieldGroup
              label="Add an IP"
              placeholder="Add an IP"
              name="device-ips"
              defaultValue=""
              showLabelforSr
            />
            {thisDevice.ips !== null && thisDevice.ips !== '' &&
              <TextList className="m-device__ip-list">
                Authorized IPs:
                <ItemContent className="m-device__ip">{deviceIps}</ItemContent> {/* this should be list */}
              </TextList>
            }
          </FormColumn>
          <FormColumn bottomSpace size="medium" className="m-device__infotext">
            <label htmlFor="device-ips">e.g., 192.168.1.11 or 192.168.1.1/24 or 192.168.1.1-20</label>
          </FormColumn>
        </FormRow>
        <FormRow className="m-device__row">
          <FormColumn bottomSpace size="medium">
            <Button plain className="m-device__submit">Save device parameters</Button>
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
  device: PropTypes.node,
};

export default DisplayDevice;
