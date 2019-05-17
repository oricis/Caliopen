import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  SelectFieldGroup as SelectFieldGroupBase, FormGrid, FormRow, FormColumn,
} from '../../../../components';
import renderReduxField from '../../../../services/renderReduxField';
import { AVAILABLE_LANGUAGES } from '../../../../modules/i18n';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);

class InterfaceSettings extends PureComponent {
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
      fr: i18n._('settings.interface.language.options.fr', null, { defaults: 'French' }),
      en: i18n._('settings.interface.language.options.en', null, { defaults: 'English' }),
      de: i18n._('settings.interface.language.options.de', null, { defaults: 'German' }),
    };
  }

  render() {
    const { i18n } = this.props;
    const languageOptions = this.getOptionsFromArray(AVAILABLE_LANGUAGES);

    return (
      <FormGrid className="m-interface-form">
        <FormRow>
          <FormColumn rightSpace={false}>
            <Field
              component={SelectFieldGroup}
              name="default_locale"
              label={i18n._('settings.interface.language.label', null, { defaults: 'Language' })}
              options={languageOptions}
              expanded
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default InterfaceSettings;
