import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, SelectFieldGroup, CheckboxFieldGroup, FormGrid, FormRow, FormColumn } from '../../../form';
import './style.scss';

const PHONE_TYPES = ['work', 'home', 'other'];

const generateStateFromProps = (props, prevState) => {
  const phone = props.phone || {};

  return {
    contactDetail: {
      ...prevState.contactDetail,
      ...phone,
    },
  };
};

class PhoneForm extends Component {
  static propTypes = {
    phone: PropTypes.shape({}),
    errors: PropTypes.arrayOf(PropTypes.string),
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onSubmit: PropTypes.func,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errors: [],
    phone: null,
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
      number: '',
      type: PHONE_TYPES[0],
      is_primary: false,
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
      work: __('contact.phone_type.work'),
      home: __('contact.phone_type.home'),
      other: __('contact.phone_type.other'),
    };
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ contactDetail });
  }

  handleDelete = () => {
    const { onDelete, phone } = this.props;
    onDelete({ contactDetail: phone });
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

  handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    this.setState(prevState => ({
      contactDetail: {
        ...prevState.contactDetail,
        [name]: checked,
      },
    }));
  }

  render() {
    const { __, errors = [], phone } = this.props;
    const typeOptions = PHONE_TYPES.map(value => ({
      value,
      label: this.addressTypes[value],
    }));

    return (
      <FormGrid
        onSubmit={this.handleSubmit}
        className="m-phone-form"
        name="phone_form"
      >
        <Fieldset>
          <Legend>
            <Icon rightSpaced type="phone" />
            {__('contact.phone_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn fluid>
              <CheckboxFieldGroup
                name="is_primary"
                label={__('contact.phone_form.is_primary.label')}
                value={this.state.contactDetail.is_primary}
                onChange={this.handleSwitchChange}
                displaySwitch
                showTextLabel
              />
            </FormColumn>
            <FormColumn fluid>
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
            <FormColumn fluid>
              <SelectFieldGroup
                name="type"
                value={this.state.contactDetail.type}
                onChange={this.handleInputChange}
                label={__('contact.phone_form.type.label')}
                showLabelforSr
                options={typeOptions}
              />
            </FormColumn>
            <FormColumn fluid>
              {!phone ?
                <Button type="submit" shape="plain" icon="plus" responsive="icon-only">
                  {__('contact.action.add_contact_detail')}
                </Button>
              :
                <Button icon="remove" onClick={this.handleDelete} />
              }

            </FormColumn>
          </FormRow>
        </Fieldset>
      </FormGrid>
    );
  }
}

export default PhoneForm;
