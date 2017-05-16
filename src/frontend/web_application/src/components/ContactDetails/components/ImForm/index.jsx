import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import { FieldErrors, Fieldset, Legend, TextFieldGroup, SelectFieldGroup, FormGrid, FormRow, FormColumn } from '../../../form';
import './style.scss';

const IM_TYPES = ['work', 'home', 'other', 'netmeeting'];

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
        type: IM_TYPES[0],
      },
    };
    this.initTranslations();
  }

  initTranslations() {
    const { __ } = this.props;
    this.addressTypes = {
      work: __('contact.im_type.work'),
      home: __('contact.im_type.home'),
      other: __('contact.im_type.other'),
      netmeeting: __('contact.im_type.netmeeting'),
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { contactDetail } = this.state;
    this.props.onSubmit({ im: contactDetail });
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
    const addressTypeOptions = IM_TYPES.map(value => ({
      value,
      label: this.addressTypes[value],
    }));

    return (
      <FormGrid onSubmit={this.handleSubmit} className="m-im-form" name="im_form">
        <Fieldset>
          <Legend>
            <Icon className="m-im-form__icon" type="comment" />
            {__('contact.im_form.legend')}
          </Legend>
          <FormRow>
            {errors.length > 0 && (<FormColumn><FieldErrors errors={errors} /></FormColumn>)}
            <FormColumn size="medium">
              <TextFieldGroup
                name="address"
                type="email"
                value={this.state.contactDetail.address}
                onChange={this.handleInputChange}
                label={__('contact.im_form.address.label')}
                showLabelforSr
                required
              />
            </FormColumn>
            <FormColumn size="shrink">
              <SelectFieldGroup
                name="type"
                value={this.state.contactDetail.type}
                onChange={this.handleInputChange}
                label={__('contact.im_form.type.label')}
                showLabelforSr
                options={addressTypeOptions}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-im-form__action">
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
