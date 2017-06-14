import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, SelectFieldGroup, FormGrid, FormRow, FormColumn, CheckboxFieldGroup } from '../../../form';
import './style.scss';

const EMAIL_TYPES = ['work', 'home', 'other'];

class EmailForm extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errors: [],
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.state = {
      contactDetail: {
        address: '',
        type: EMAIL_TYPES[0],
        is_primary: false,
      },
    };
    this.initTranslations();
  }

  initTranslations() {
    const { __ } = this.props;
    this.addressTypes = {
      work: __('contact.email_type.work'),
      home: __('contact.email_type.home'),
      other: __('contact.email_type.other'),
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ email: contactDetail });
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      contactDetail: {
        ...prevState.contactDetail,
        [name]: value,
      },
    }));
  }

  handleSwitchChange(event) {
    const { name, checked } = event.target;
    this.setState(prevState => ({
      contactDetail: {
        ...prevState.contactDetail,
        [name]: checked,
      },
    }));
  }

  render() {
    const { __, errors = [] } = this.props;
    const addressTypeOptions = EMAIL_TYPES.map(value => ({
      value,
      label: this.addressTypes[value],
    }));

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-email-form" name="email_form">
        <Fieldset>
          <Legend>
            <Icon className="m-email-form__icon" type="envelope" />
            {__('contact.email_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="medium">
              <TextFieldGroup
                name="address"
                type="email"
                value={this.state.contactDetail.address}
                onChange={this.handleInputChange}
                label={__('contact.email_form.address.label')}
                showLabelforSr
                required
              />
            </FormColumn>
            <FormColumn size="shrink">
              <SelectFieldGroup
                name="type"
                value={this.state.contactDetail.type}
                onChange={this.handleInputChange}
                label={__('contact.email_form.type.label')}
                showLabelforSr
                options={addressTypeOptions}
              />
            </FormColumn>
            <FormColumn size="shrink" className="s-contact-detail-form__checkbox-label">
              <CheckboxFieldGroup
                name="is_primary"
                value={this.state.contactDetail.is_primary}
                onChange={this.handleSwitchChange}
                label={__('contact.email_form.is_primary.label')}
                displaySwitch
                showTextLabel
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-email-form__action">
              <Button type="submit" display="expanded" shape="plain" icon="plus">
                {__('contact.action.add_contact_detail')}
              </Button>
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default EmailForm;
