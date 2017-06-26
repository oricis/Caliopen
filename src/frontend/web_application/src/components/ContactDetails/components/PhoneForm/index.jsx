import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, SelectFieldGroup, CheckboxFieldGroup, FormGrid, FormRow, FormColumn } from '../../../form';
import './style.scss';

const PHONE_TYPES = ['work', 'home', 'other'];

class PhoneForm extends Component {
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
        number: '',
        type: PHONE_TYPES[0],
        is_primary: false,
      },
    };
    this.initTranslations();
  }

  initTranslations() {
    const { __ } = this.props;
    this.addressTypes = {
      work: __('contact.phone_type.work'),
      home: __('contact.phone_type.home'),
      other: __('contact.phone_type.other'),
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ contactDetail });
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
    const typeOptions = PHONE_TYPES.map(value => ({
      value,
      label: this.addressTypes[value],
    }));

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-phone-form" name="phone_form">
        <Fieldset>
          <Legend>
            <Icon className="m-phone-form__icon" type="phone" />
            {__('contact.phone_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="medium">
              <TextFieldGroup
                name="number"
                type="tel"
                value={this.state.contactDetail.number}
                onChange={this.handleInputChange}
                label={__('contact.phone_form.number.label')}
                showLabelforSr
                required
              />
            </FormColumn>
            <FormColumn size="shrink">
              <SelectFieldGroup
                name="type"
                value={this.state.contactDetail.type}
                onChange={this.handleInputChange}
                label={__('contact.phone_form.type.label')}
                showLabelforSr
                options={typeOptions}
              />
            </FormColumn>
            <FormColumn size="shrink">
              <CheckboxFieldGroup
                name="is_primary"
                value={this.state.contactDetail.is_primary}
                onChange={this.handleSwitchChange}
                label={__('contact.phone_form.is_primary.label')}
                displaySwitch
                showTextLabel
              />
            </FormColumn>
            <FormColumn size="shrink" className="m-phone-form__action">
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

export default PhoneForm;
