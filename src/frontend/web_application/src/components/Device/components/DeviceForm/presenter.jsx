import React, { Component, PropTypes } from 'react';
import Icon from '../../../../components/Icon';
import Button from '../../../../components/Button';
import { FormGrid, FormRow, FormColumn, Fieldset, Legend, TextFieldGroup, SelectFieldGroup } from '../../../../components/form';
import './style.scss';

function generateStateFromProps(props) {
  return {
    device: {
      name: '',
      type: '',
      ips: [],
      ...props.device,
    },
  };
}

class DeviceForm extends Component {
  static propTypes = {
    device: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...generateStateFromProps(this.props),
      newIP: '',
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleClickNewIP = this.handleClickNewIP.bind(this);
    this.handleNewIPChange = this.handleNewIPChange.bind(this);
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(newProps) {
    this.setState(generateStateFromProps(newProps));
  }

  handleFieldChange(ev) {
    const { name, value } = ev.target;
    this.setState(prevState => ({
      device: {
        ...prevState.device,
        [name]: value,
      },
    }));
  }

  handleNewIPChange(ev) {
    const { value: newIP } = ev.target;
    this.setState({ newIP });
  }

  handleClickNewIP() {
    if (this.state.newIP) {
      this.setState(prevState => ({
        device: {
          ...prevState.device,
          ips: [prevState.newIP, ...prevState.device.ips],
        },
        newIP: '',
      }));
    }
  }

  render() {
    const { __ } = this.props;
    const deviceTypes = [
      { value: 'desktop', label: __('device.type.desktop') },
      { value: 'laptop', label: __('device.type.laptop') },
      { value: 'smartphone', label: __('device.type.smartphone') },
      { value: 'tablet', label: __('device.type.tablet') },
    ];

    return (
      <FormGrid className="m-device-form">
        <Fieldset className="m-device-form__fieldset">
          <Legend>{__('device.manage_form.name.label')}</Legend>
          <FormRow reverse>
            <FormColumn bottomSpace size="medium">
              <label htmlFor="device-name">{__('device.manage_form.name.infotext')}</label>
            </FormColumn>
            <FormColumn bottomSpace size="medium">
              <TextFieldGroup
                label={__('device.manage_form.name.label')}
                name="name"
                id="device-name"
                showLabelforSr
                value={this.state.device.name}
                onChange={this.handleFieldChange}
              />
            </FormColumn>
          </FormRow>
        </Fieldset>
        <Fieldset className="m-device-form__fieldset">
          <Legend>{__('device.manage_form.type.label')}</Legend>
          <FormRow reverse>
            <FormColumn bottomSpace size="medium">
              <label htmlFor="device-type">{__('device.manage_form.type.infotext')}</label>
            </FormColumn>
            <FormColumn size="medium">
              <SelectFieldGroup
                className="m-device-form__type"
                label={__('device.manage_form.type.label')}
                name="type"
                id="device-type"
                showLabelforSr
                value={this.state.device.type}
                options={deviceTypes}
                onChange={this.handleFieldChange}
              />
            </FormColumn>
          </FormRow>
        </Fieldset>
        <Fieldset className="m-device-form__fieldset">
          <Legend>{__('device.manage_form.ips.label')}</Legend>
          <FormRow reverse>
            <FormColumn bottomSpace size="medium">
              <label htmlFor="device-ips">{__('device.manage_form.ips.infotext')}</label>
            </FormColumn>
            <FormColumn bottomSpace size="medium">
              <div className="m-device-form__ip">
                <TextFieldGroup
                  label={__('device.manage_form.add-ip.label')}
                  placeholder={__('device.manage_form.add-ip.label')}
                  name="newIP"
                  value={this.state.newIP}
                  onChange={this.handleNewIPChange}
                  className="m-device-form__ip-input"
                  showLabelforSr
                />
                <Button plain inline className="m-device-form__ip-button" onClick={this.handleClickNewIP}><Icon type="plus" /></Button>
              </div>
              {this.state.device.ips.map((ip, key) =>
                <div className="m-device-form__ip" key={key}>
                  <TextFieldGroup
                    label={__('device.form.ips.label')}
                    name={ip}
                    defaultValue={ip}
                    className="m-device-form__ip-input"
                    showLabelforSr
                    readOnly
                  />
                  <Button plain inline className="m-device-form__ip-button"><Icon type="remove" /></Button>
                </div>
              )}
            </FormColumn>
          </FormRow>
        </Fieldset>
        <FormRow>
          <FormColumn size="medium">
            <Button plain>{__('device.action.save_changes')}</Button>
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default DeviceForm;
