import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Button from '../../../../components/Button';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup as SelectFieldGroupBase, FieldErrors } from '../../../../components/form';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);
const DISPLAY_FORMAT = ['given_name, family_name', 'family_name, given_name'];
const DISPLAY_ORDER_BY = ['given_name', 'family_name'];

class ContactsForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    requestSettings: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errors: {},
  };

  componentWillMount() {
    this.initTranslations();
  }

  componentDidMount() {
    this.props.requestSettings();
  }

  getOptionsFromArray = options => options.map(value => ({
    value,
    label: this.i18n[value] || value,
  }));

  handleSubmit = (ev) => {
    const { handleSubmit, requestSettings } = this.props;

    return handleSubmit(ev).then(requestSettings);
  }

  initTranslations() {
    const { __ } = this.props;
    this.i18n = {
      'given_name, family_name': __('settings.contact.display-format.options.first-last'),
      'family_name, given_name': __('settings.contact.display-format.options.last-first'),
      given_name: __('settings.contact.display-order-by.options.firstname'),
      family_name: __('settings.contact.display-order-by.options.lastname'),
    };
  }

  render() {
    const { errors, __ } = this.props;

    const displayFormatOptions = this.getOptionsFromArray(DISPLAY_FORMAT);
    const displayOrderByOptions = this.getOptionsFromArray(DISPLAY_ORDER_BY);

    return (
      <FormGrid className="m-contacts-form">
        <form method="post" name="contacts_form" onSubmit={this.handleSubmit}>
          {errors.global && errors.global.length !== 0 && (
          <FormRow>
            <FormColumn bottomSpace>
              <FieldErrors errors={errors.global} />
            </FormColumn>
          </FormRow>
          )}
          <FormRow>
            <FormColumn size="shrink" bottomSpace >
              <Field
                component={SelectFieldGroup}
                name="contact_display_format"
                label={__('settings.contacts.display.label')}
                options={displayFormatOptions}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" bottomSpace >
              <Field
                component={SelectFieldGroup}
                name="contact_display_order_by"
                label={__('settings.contacts.order.label')}
                options={displayOrderByOptions}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-contacts-form__action" bottomSpace>
              <Button type="submit" shape="plain">{__('settings.contacts.update.action')}</Button>
            </FormColumn>
          </FormRow>
        </form>
      </FormGrid>
    );
  }
}

export default ContactsForm;
