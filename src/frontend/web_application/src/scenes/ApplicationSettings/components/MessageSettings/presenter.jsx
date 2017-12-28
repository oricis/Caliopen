import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup as SelectFieldGroupBase } from '../../../../components/form';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);

const DISPLAY_FORMATS = ['rich_text', 'plain_text'];

class PresentationForm extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
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
      rich_text: i18n._('settings.message.display_format.options.rich_text'),
      plain_text: i18n._('settings.message.display_format.options.plain_text'),
    };
  }

  render() {
    const { i18n } = this.props;

    const displayFormatOptions = this.getOptionsFromArray(DISPLAY_FORMATS);

    return (
      <FormGrid className="m-settings-message-form">
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={SelectFieldGroup}
              name="message_display_format"
              label={i18n._('settings.message.display_format.label')}
              options={displayFormatOptions}
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default PresentationForm;
