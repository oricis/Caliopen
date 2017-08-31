import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextList, { ItemContent } from '../../../../components/TextList';
import { SelectFieldGroup } from '../../../../components/form';

class AddFormFieldForm extends Component {
  static propTypes = {
    form: PropTypes.string.isRequired,
    addField: PropTypes.func.isRequired,
    formValues: PropTypes.shape({}).isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };
  state = {};

  componentWillMount() {

  }

  componentWillReceiveProps() {

  }

  handleSelectChange = (ev) => {
    const { form, addField } = this.props;
    const { value: type } = ev.target;

    addField(form, `${type}`, {});
  }

  render() {
    const { formValues, __ } = this.props;

    const typeOptionsConfig = {
      emails: {
        label: __('contact.form-selector.email_form.label'),
        value: 'emails',
      },
      phones: {
        label: __('contact.form-selector.phone_form.label'),
        value: 'phones',
      },
      ims: {
        label: __('contact.form-selector.im_form.label'),
        value: 'ims',
      },
      addresses: {
        label: __('contact.form-selector.address_form.label'),
        value: 'addresses',
      },
    };

    const typeOptions = Object.keys(typeOptionsConfig).reduce((acc, type) => {
      if (formValues[type] && formValues[type].length) {
        return acc;
      }

      return [...acc, typeOptionsConfig[type]];
    }, [{ label: ' - ', value: null }]);

    if (!typeOptions.length) {
      return null;
    }

    return (
      <TextList>
        <ItemContent>
          <SelectFieldGroup
            name="selectedForm"
            onChange={this.handleSelectChange}
            label={__('contact.form-selector.add_new_field.label')}
            options={typeOptions}
          />
        </ItemContent>
      </TextList>
    );
  }
}

export default AddFormFieldForm;
