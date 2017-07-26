import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup, FieldErrors } from '../form';

import './style.scss';

const DISPLAY_CONTACTS = ['Firstname, Lastname', 'Lastname, Firstname'];
const ORDER_CONTACTS = ['Lastname', 'Firstname'];
const CONTACT_FORMATS = ['Firstname only', 'Lastname only', 'Lastname and Firstname'];
const ADRESS_FORMATS = ['French', 'US'];
const PHONE_FORMATS = ['+33.XXXXXXXXXX', 'XXXXXXXXXX'];
const VCARD_FORMATS = ['2.1', '3.0', '4.0'];
const VCARD_ENCODING = ['Occidental', 'Oriental'];

function generateStateFromProps(props, prevState) {
  return {
    settings: {
      ...prevState.settings,
      ...props.settings,
    },
  };
}

class ContactsForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    onSubmit: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errors: {},
  };

  state = {
    settings: {
      display: '',
      order: '',
      contact_format: '',
      adress_format: '',
      phone_format: '',
      vcard_format: '',
      vcard_encoding: '',
    },
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => generateStateFromProps(newProps, prevState));
  }

  getOptionsFromArray = (options, setting) => {
    const selectedOptions = options.map(value => ({
      value,
      label: value,
      selected: setting === value && true,
    }));

    return selectedOptions;
  }

  handleSubmit = () => {
    const { settings } = this.state;
    this.props.onSubmit({ settings });
  }

  handleInputChange = (/* ev */) => {
    // const { name, value } = ev.target;

    // this.setState((prevState) => {});
  }

  render() {
    const { errors, __ } = this.props;
    const { settings } = this.state;

    const displayOptions = this.getOptionsFromArray(DISPLAY_CONTACTS, settings.display);
    const orderOptions = this.getOptionsFromArray(ORDER_CONTACTS, settings.order);
    const contactFormatOptions = this.getOptionsFromArray(CONTACT_FORMATS, settings.contact_format);
    const adressFormatOptions = this.getOptionsFromArray(ADRESS_FORMATS, settings.adress_format);
    const phoneFormatOptions = this.getOptionsFromArray(PHONE_FORMATS, settings.phone_format);
    const vcardFormatOptions = this.getOptionsFromArray(VCARD_FORMATS, settings.vcard_format);
    const vcardEncodingOptions = this.getOptionsFromArray(VCARD_ENCODING, settings.vcard_encoding);


    return (
      <FormGrid method="post" className="m-contacts-form" name="contacts_form">
        {errors.global && errors.global.length !== 0 && (
        <FormRow>
          <FormColumn bottomSpace>
            <FieldErrors errors={errors.global} />
          </FormColumn>
        </FormRow>
        )}
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <SelectFieldGroup
              name="display"
              defaultValue={settings.display}
              onChange={this.handleInputChange}
              label={__('settings.contacts.display.label')}
              options={displayOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <SelectFieldGroup
              name="order"
              defaultValue={settings.order}
              onChange={this.handleInputChange}
              label={__('settings.contacts.order.label')}
              options={orderOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace>
            <SelectFieldGroup
              name="contact_format"
              defaultValue={settings.contact_format}
              onChange={this.handleInputChange}
              label={__('settings.contacts.contact_format.label')}
              options={contactFormatOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <SelectFieldGroup
              name="adress_format"
              defaultValue={settings.adress_format}
              onChange={this.handleInputChange}
              label={__('settings.contacts.adress_format.label')}
              options={adressFormatOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <SelectFieldGroup
              name="phone_format"
              defaultValue={settings.phone_format}
              onChange={this.handleInputChange}
              label={__('settings.contacts.phone_format.label')}
              options={phoneFormatOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <SelectFieldGroup
              name="vcard_format"
              defaultValue={settings.vcard_format}
              onChange={this.handleInputChange}
              label={__('settings.contacts.vcard_format.label')}
              options={vcardFormatOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <SelectFieldGroup
              name="vcard_encoding"
              defaultValue={settings.vcard_encoding}
              onChange={this.handleInputChange}
              label={__('settings.contacts.vcard_encoding.label')}
              options={vcardEncodingOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" className="m-contacts-form__action" bottomSpace>
            <Button
              type="submit"
              onClick={this.handleSubmit}
              shape="plain"
            >{__('settings.contacts.update.action')}</Button>
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default ContactsForm;
