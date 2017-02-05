import React, { PropTypes } from 'react';
import Title from '../../components/Title';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import PiBar from '../../components/PiBar/presenter';
import { FormGrid, FormRow, FormColumn, Fieldset, Legend, TextFieldGroup, SelectFieldGroup } from '../../components/form';

import './style.scss';

const DeviceForm = ({ device, __ }) => {
  const deviceIPs = Array.from(new Set(device.ips));
  const lastSeenDate = new Date(device.last_seen).toLocaleDateString();
  const insertDate = new Date(device.date_insert).toLocaleDateString();
  const deviceTypes = [
    { value: 'desktop', label: __('device.type.desktop') },
    { value: 'laptop', label: __('device.type.laptop') },
    { value: 'smartphone', label: __('device.type.smartphone') },
    { value: 'tablet', label: __('device.type.tablet') },
  ];

  return (
    <div className="m-device">

      <div className="m-device__section m-device__pi">
        <PiBar level={device.pi ? device.pi : 0} />
      </div>

      <FormGrid className="m-device__section m-device__form">
        <Title align="center" className="m-device__title">{__('device.manage.title')}</Title>
        <FormRow className="m-device__intro"><p>{__('device.manage.descr')}</p></FormRow>
        <Fieldset>
          <Legend>{__('device.manage_form.name.label')}</Legend>
          <FormRow reverse>
            <FormColumn bottomSpace size="medium" className="m-device__infotext">
              <label htmlFor="device-name">{__('device.manage_form.name.infotext')}</label>
            </FormColumn>
            <FormColumn bottomSpace size="medium">
              <TextFieldGroup
                label={__('device.manage_form.name.label')}
                name="device-name"
                id="device-name"
                showLabelforSr
                key={device.name}
                defaultValue={device.name}
              />
            </FormColumn>
          </FormRow>
        </Fieldset>
        <Fieldset>
          <Legend>{__('device.manage_form.type.label')}</Legend>
          <FormRow reverse>
            <FormColumn bottomSpace size="medium" className="m-device__infotext">
              <label htmlFor="device-type">{__('device.manage_form.type.infotext')}</label>
            </FormColumn>
            <FormColumn size="medium">
              <SelectFieldGroup
                className="m-device__type"
                label={__('device.manage_form.type.label')}
                name="device-type"
                id="device-type"
                showLabelforSr
                value={device.type}
                options={deviceTypes}
              />
            </FormColumn>
          </FormRow>
        </Fieldset>
        <Fieldset>
          <Legend>{__('device.manage_form.ips.label')}</Legend>
          <FormRow reverse>
            <FormColumn bottomSpace className="m-device__infotext" size="medium">
              <label htmlFor="device-ips">{__('device.manage_form.ips.infotext')}</label>
            </FormColumn>
            <FormColumn bottomSpace size="medium">
              <div className="m-device__ip">
                <TextFieldGroup
                  label={__('device.action.add-ip')}
                  placeholder={__('device.action.add_ip')}
                  name="device-ips"
                  defaultValue=""
                  className="m-device__ip-input"
                  showLabelforSr
                />
                <Button plain className="m-device__ip-button"><Icon type="plus" /></Button>
              </div>
              {deviceIPs.map(ip =>
                <div className="m-device__ip" key={ip}>
                  <TextFieldGroup
                    label={__('device.form.ips.label')}
                    name={ip}
                    defaultValue={ip}
                    className="m-device__ip-input"
                    showLabelforSr
                  />
                  <Button plain className="m-device__ip-button"><Icon type="remove" /></Button>
                </div>
              )}
            </FormColumn>
          </FormRow>
        </Fieldset>
        <FormRow>
          <FormColumn align="center" size="medium">
            <Button plain>{__('device.action.save_changes')}</Button>
          </FormColumn>
        </FormRow>
      </FormGrid>

      <section className="m-device__section">
        <Title align="center" className="m-device__title">{__('device.info.title')}</Title>
        <FormRow>
          <FormColumn size="medium" align="right">{('device.info.date_insert')}</FormColumn>
          <FormColumn size="medium" bottomSpace><Badge noRadius>{insertDate}</Badge></FormColumn>
          <FormColumn size="medium" align="right">{('device.info.last_seen')}</FormColumn>
          <FormColumn size="medium" bottomSpace><Badge noRadius>{lastSeenDate}</Badge></FormColumn>
          <FormColumn size="medium" align="right">{__('device.info.os')}</FormColumn>
          <FormColumn size="medium" bottomSpace><Badge noRadius>{device.os}</Badge></FormColumn>
          <FormColumn size="medium" align="right">{__('device.info.os-version')}</FormColumn>
          <FormColumn size="medium" bottomSpace><Badge noRadius>{device.os_version}</Badge></FormColumn>
        </FormRow>
      </section>

      <FormGrid className="m-device__section">
        <Title align="center" className="m-device__title">{__('device.revoke.title')}</Title>
        <FormRow>
          <FormColumn align="center" bottomSpace className="m-device__intro">
            <p>{__('device.revoke.descr')}</p>
          </FormColumn>
          <FormColumn align="center">
            <Button plain alert>{__('device.action.revoke')}</Button>
          </FormColumn>
        </FormRow>
      </FormGrid>
    </div>
  );
};


DeviceForm.propTypes = {
  device: PropTypes.shape({}),
  __: PropTypes.func,
};

export default DeviceForm;
