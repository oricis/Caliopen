import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, SelectFieldGroup, FormGrid, FormRow, FormColumn } from '../../../form';
import './style.scss';

const ADDRESS_TYPES = ['work', 'home', 'other'];

const generateStateFromProps = (props, prevState) => {
  const address = props.address || {};

  return {
    contactDetail: {
      ...prevState.contactDetail,
      ...address,
    },
  };
};

class AddressForm extends Component {
  static propTypes = {
    address: PropTypes.shape({}),
    errors: PropTypes.arrayOf(PropTypes.string),
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onSubmit: PropTypes.func,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errors: [],
    address: null,
    onDelete: () => {},
    onEdit: () => {},
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.initTranslations();
  }

  state = {
    contactDetail: {
      street: '',
      postal_code: '',
      city: '',
      country: '',
      region: '',
      type: ADDRESS_TYPES[0],
    },
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => generateStateFromProps(nextProps, prevState));
  }

  initTranslations() {
    const { __ } = this.props;
    this.addressTypes = {
      work: __('contact.address_type.work'),
      home: __('contact.address_type.home'),
      other: __('contact.address_type.other'),
    };
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ contactDetail });
  }

  handleDelete = () => {
    const { onDelete, address } = this.props;
    onDelete({ contactDetail: address });
  }

  handleEdit = (ev) => {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onEdit({ contactDetail });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      contactDetail: {
        ...prevState.contactDetail,
        [name]: value,
      },
    }));
  }

  handleSelectCountry = (country) => {
    this.setState(prevState => ({
      contactDetail: {
        ...prevState.contactDetail,
        country,
      },
    }));
  }

  handleSelectRegion = (region) => {
    this.setState(prevState => ({
      contactDetail: {
        ...prevState.contactDetail,
        region,
      },
    }));
  }

  render() {
    const { __, errors = [], address } = this.props;
    const addressTypeOptions = ADDRESS_TYPES.map(value => ({
      value,
      label: this.addressTypes[value],
    }));

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-address-form" name="address_form">
        <Fieldset>
          <FormRow>
            <FormColumn>
              <Legend>
                <Icon rightSpaced type="map-marker" />
                {__('contact.address_form.legend')}
              </Legend>
            </FormColumn>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
          </FormRow>
          <FormRow>
            <FormColumn bottomSpace>
              <TextFieldGroup
                name="street"
                value={this.state.contactDetail.street}
                onChange={this.handleInputChange}
                label={__('contact.address_form.street.label')}
                placeholder={__('contact.address_form.street.label')}
                showLabelforSr
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="small" bottomSpace>
              <TextFieldGroup
                name="postal_code"
                value={this.state.contactDetail.postal_code}
                onChange={this.handleInputChange}
                label={__('contact.address_form.postal_code.label')}
                placeholder={__('contact.address_form.postal_code.label')}
                showLabelforSr
              />
            </FormColumn>
            <FormColumn size="large" bottomSpace>
              <TextFieldGroup
                name="city"
                value={this.state.contactDetail.city}
                onChange={this.handleInputChange}
                label={__('contact.address_form.city.label')}
                placeholder={__('contact.address_form.city.label')}
                showLabelforSr
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="medium" bottomSpace>
              {
                // TODO: insert select-wrapper to fit SelectFieldGroup architecture
              }
              <label className="show-for-sr" htmlFor="contact-adress-country">
                {__('contact.address_form.country.label')}
              </label>
              <CountryDropdown
                id="contact-adress-country"
                classes="m-address-form__select"
                defaultOptionLabel={__('contact.address_form.select_country')}
                value={this.state.contactDetail.country}
                onChange={this.handleSelectCountry}
              />
            </FormColumn>
            <FormColumn size="medium" bottomSpace>
              {
                // TODO: insert select-wrapper to fit SelectFieldGroup architecture
              }
              <label className="show-for-sr" htmlFor="contact-adress-region">
                {__('contact.address_form.region.label')}
              </label>
              <RegionDropdown
                id="contact-adress-region"
                classes="m-address-form__select"
                defaultOptionLabel={__('contact.address_form.select_region')}
                country={this.state.contactDetail.country}
                value={this.state.contactDetail.region}
                onChange={this.handleSelectRegion}
              />
            </FormColumn>
            <FormColumn size="shrink" bottomSpace fluid>
              <SelectFieldGroup
                name="type"
                value={this.state.contactDetail.type}
                onChange={this.handleInputChange}
                label={__('contact.address_form.type.label')}
                options={addressTypeOptions}
                showLabelforSr
              />
            </FormColumn>
            <FormColumn size="shrink" className="m-address-form__col-button">
              {!address ?
                <Button className="m-address-form__button" type="submit" shape="plain" display="expanded" icon="plus">
                  {__('contact.action.add_contact_detail')}
                </Button>
              :
                <Button color="alert" icon="remove" onClick={this.handleDelete} />
              }
            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default AddressForm;
