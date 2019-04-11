import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  SelectFieldGroup as SelectFieldGroupBase, FormGrid, FormRow, FormColumn,
} from '../../../../components';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);

const LANGUAGES = ['fr_FR', 'en_EN', 'de_DE'];

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
      fr_FR: i18n._('settings.interface.language.options.fr', null, { defaults: 'French' }),
      en_EN: i18n._('settings.interface.language.options.en', null, { defaults: 'English' }),
      de_DE: i18n._('settings.interface.language.options.de', null, { defaults: 'German' }),
    };
  }

  render() {
    const { i18n } = this.props;
    const languageOptions = this.getOptionsFromArray(LANGUAGES);

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
