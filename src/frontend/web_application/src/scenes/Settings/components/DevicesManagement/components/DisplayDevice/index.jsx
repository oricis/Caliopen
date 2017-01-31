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
    <FormGrid className="m-device">
      <FormRow className="m-device__row">
        <PiBar level={thisDevice.pi} className="m-device__pi" />
      </FormRow>
      <FormRow className="m-device__row m-device__row--separated m-device__title">
        <FormColumn bottomSpace size="expanded">
          <Title>Manage your device</Title>
        </FormColumn>
      </FormRow>
      <FormRow className="m-device__row">
        <FormColumn bottomSpace size="medium" className="m-device__col">
          <TextFieldGroup
            label="Name"
            name="device-name"
            key={thisDevice.name}
            defaultValue={thisDevice.name}
          />
        </FormColumn>
        <FormColumn bottomSpace size="medium" className="m-device__col m-device__infotext">
          This is the name which allows you to identify your device everywhere.
        </FormColumn>
      </FormRow>
      <FormRow className="m-device__row">
        <FormColumn bottomSpace size="medium" className="m-device__col">
          <SelectFieldGroup
            label="Type"
            name="device-type"
            value={thisDevice.type}
            // onChange={handleInputChange}
            options={[{ value: 'desktop', label: 'Desktop' }, { value: 'laptop', label: 'Laptop' }, { value: 'smartphone', label: 'Smartphone' }, { value: 'tablet', label: 'Tablet' }]}
            /* options={thisDevice.map((d) => {
              return {
                value: thisDevice.device_id,
                label: thisDevice.name,
              };
            })} */
          />
        </FormColumn>
        <FormColumn bottomSpace size="medium" className="m-device__col m-device__infotext">
          Select a type of device: Desktop, Laptop, Smartphone or Tablet.
        </FormColumn>
      </FormRow>
      <FormRow className="m-device__row">
        <FormColumn bottomSpace size="medium" className="m-device__col">
          <TextFieldGroup
            label="Add an IP"
            name="device-ips"
            defaultValue=""
          />
          <TextList className="m-device__ip-list">
            Authorized IPs:
            <ItemContent className="m-device__ip">{deviceIps}</ItemContent> {/* this should be list */}
          </TextList>
        </FormColumn>
        <FormColumn bottomSpace size="medium" className="m-device__col m-device__infotext">
          e.g., 192.168.1.11 or 192.168.1.1/24 or 192.168.1.1-20
        </FormColumn>
      </FormRow>
      <FormRow className="m-device__row">
        <FormColumn bottomSpace size="medium" className="m-device__col">
          <Button plain className="m-device__submit">Save device parameters</Button>
        </FormColumn>
      </FormRow>
      <FormRow className="m-device__row m-device__row--separated m-device__title">
        <FormColumn bottomSpace size="expanded">
          <Title>Device info</Title>
        </FormColumn>
      </FormRow>
      <FormRow className="m-device__row">
        <FormColumn size="medium" className="m-device__col">
          Last connexion: {thisDevice.last_seen}
        </FormColumn>
      </FormRow>
      <FormRow className="m-device__row">
        <FormColumn size="medium" className="m-device__col">
          OS: {thisDevice.os}
        </FormColumn>
        <FormColumn size="medium" className="m-device__col">
          Version: {thisDevice.os_version}
        </FormColumn>
      </FormRow>
    </FormGrid>
  );
};


DisplayDevice.propTypes = {
  device: PropTypes.node,
};

export default DisplayDevice;
