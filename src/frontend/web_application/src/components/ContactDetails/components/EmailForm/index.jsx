import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, SelectFieldGroup, FormGrid, FormRow, FormColumn, CheckboxFieldGroup } from '../../../form';
import './style.scss';

const EMAIL_TYPES = ['work', 'home', 'other'];

const generateStateFromProps = (props, prevState) => {
  const email = props.email || {};

  return {
    contactDetail: {
      ...prevState.contactDetail,
      ...email,
    },
  };
};

class EmailForm extends Component {
  static propTypes = {
    email: PropTypes.shape({}),
    errors: PropTypes.arrayOf(PropTypes.string),
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onSubmit: PropTypes.func,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errors: [],
    email: null,
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
      address: '',
      type: EMAIL_TYPES[0],
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
      work: __('contact.email_type.work'),
      home: __('contact.email_type.home'),
      other: __('contact.email_type.other'),
    };
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ contactDetail });
  }

  handleDelete = () => {
    const { onDelete, email } = this.props;
    onDelete({ contactDetail: email });
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
    const { __, errors = [], email } = this.props;
    const addressTypeOptions = EMAIL_TYPES.map(value => ({
      value,
      label: this.addressTypes[value],
    }));

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-email-form" name="email_form">
        <Fieldset>
          <Legend>
            <Icon type="envelope" rightSpaced />
            {__('contact.email_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="shrink">
              <CheckboxFieldGroup
                name="is_primary"
                checked={this.state.contactDetail.is_primary}
                onChange={this.handleSwitchChange}
                label={__('contact.email_form.is_primary.label')}
                displaySwitch
              />
            </FormColumn>
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
            <FormColumn size="shrink" className="m-email-form__action">
              {!email ?
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

export default EmailForm;
