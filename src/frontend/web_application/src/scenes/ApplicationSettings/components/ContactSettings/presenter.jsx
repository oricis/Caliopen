import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup as SelectFieldGroupBase } from '../../../../components/form';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);
const DISPLAY_FORMAT = ['given_name, family_name', 'family_name, given_name'];
const DISPLAY_ORDER_BY = ['given_name', 'family_name'];

class ContactsForm extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
    errors: {},
  };

  componentWillMount() {
    this.initTranslations();
  }

  getOptionsFromArray = options => options.map(value => ({
    value,
    label: this.i18n[value] || value,
  }));

  initTranslations() {
    const { i18n } = this.props;
    this.i18n = {
      'given_name, family_name': i18n._('settings.contact.display_format.options.first_last', { defaults: 'Firstname, Lastname' }),
      'family_name, given_name': i18n._('settings.contact.display_format.options.last_first', { defaults: 'Lastname, Firstname' }),
      given_name: i18n._('settings.contact.display_order_by.options.firstname', { defaults: 'Firstname' }),
      family_name: i18n._('settings.contact.display_order_by.options.lastname', { defaults: 'Lastname' }),
    };
  }

  render() {
    const { i18n } = this.props;

    const displayFormatOptions = this.getOptionsFromArray(DISPLAY_FORMAT);
    const displayOrderByOptions = this.getOptionsFromArray(DISPLAY_ORDER_BY);

    return (
      <FormGrid className="m-contacts-form">
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={SelectFieldGroup}
              name="contact_display_format"
              label={i18n._('settings.contacts.display.label', { defaults: 'Display' })}
              options={displayFormatOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={SelectFieldGroup}
              name="contact_display_order"
              label={i18n._('settings.contacts.order.label', { defaults: 'Order by' })}
              options={displayOrderByOptions}
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default ContactsForm;
