import React, { PropTypes } from 'react';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import DefList from '../../components/DefList';
import Section from '../../components/Section';
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

      <Section className="m-device__pi">
        <PiBar level={device.pi ? device.pi : 0} />
      </Section>

      <Section
        title={__('device.manage.title')}
        descr={__('device.manage.descr')}
      >
        <FormGrid className="m-device__form">
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
                    <Button plain alert className="m-device__ip-button"><Icon type="remove" /></Button>
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
      </Section>

      <Section title={__('device.info.title')}>
        <DefList>{[
          { title: __('device.info.date_insert'), descriptions: [insertDate] },
          { title: __('device.info.last_seen'), descriptions: [lastSeenDate] },
          { title: __('device.info.os'), descriptions: [device.os] },
          { title: __('device.info.os-version'), descriptions: [device.os_version] },
        ]}
        </DefList>
      </Section>

      <Section
        title={__('device.revoke.title')}
        descr={__('device.revoke.descr')}
      >
        <FormGrid>
          <FormRow>
            <Button plain alert>{__('device.action.revoke')}</Button>
          </FormRow>
        </FormGrid>
      </Section>
    </div>
  );
};


DeviceForm.propTypes = {
  device: PropTypes.shape({}),
  __: PropTypes.func,
};

export default DeviceForm;
