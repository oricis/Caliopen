import React, { Component, PropTypes } from 'react';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, SelectFieldGroup, FormGrid, FormRow, FormColumn } from '../../../form';
import './style.scss';

const ADDRESS_TYPES = ['work', 'home', 'other'];

class AddressForm extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      contactDetail: {
        street: '',
        postal_code: '',
        city: '',
        country: '',
        region: '',
        type: ADDRESS_TYPES[0],
      },
    };
    this.initTranslations();
  }

  initTranslations() {
    const { __ } = this.props;
    this.addressTypes = {
      work: __('contact.address_type.work'),
      home: __('contact.address_type.home'),
      other: __('contact.address_type.other'),
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ address: contactDetail });
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

  render() {
    const { __, errors = [] } = this.props;
    const addressTypeOptions = ADDRESS_TYPES.map(value => ({
      value,
      label: this.addressTypes[value],
    }));

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-address-form" name="address_form">
        <Fieldset>
          <Legend>
            <Icon className="m-address-form__icon" type="map-marker" />
            {__('contact.address_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="medium">
              <TextFieldGroup
                name="street"
                value={this.state.contactDetail.street}
                onChange={this.handleInputChange}
                label={__('contact.address_form.street.label')}
              />
            </FormColumn>
            <FormColumn size="shrink">
              <TextFieldGroup
                name="postal_code"
                value={this.state.contactDetail.postal_code}
                onChange={this.handleInputChange}
                label={__('contact.address_form.postal_code.label')}
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="city"
                value={this.state.contactDetail.city}
                onChange={this.handleInputChange}
                label={__('contact.address_form.city.label')}
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="country"
                value={this.state.contactDetail.country}
                onChange={this.handleInputChange}
                label={__('contact.address_form.country.label')}
              />
            </FormColumn>
            <FormColumn size="medium">
              <TextFieldGroup
                name="region"
                value={this.state.contactDetail.region}
                onChange={this.handleInputChange}
                label={__('contact.address_form.region.label')}
              />
            </FormColumn>
            <FormColumn size="shrink">
              <SelectFieldGroup
                name="type"
                value={this.state.contactDetail.type}
                onChange={this.handleInputChange}
                label={__('contact.address_form.type.label')}
                options={addressTypeOptions}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-address-form__action">
              <Button type="submit" expanded plain>
                <Icon type="plus" />
                {' '}
                {__('contact.action.add_contact_detail')}
              </Button>
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default AddressForm;
