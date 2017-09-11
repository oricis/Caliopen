import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import moment from 'moment-timezone';
import Button from '../../../../components/Button';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup as SelectFieldGroupBase, FieldErrors } from '../../../../components/form';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);

const LANGUAGES = ['fr_FR', 'en_EN'];
const TIMEZONES = moment.tz.names();
const DATE_FORMATS = ['DD/MM/YYYY HH:mm:ss', 'MM/DD/YYYY h:mm:ss a'];
// const TIME_FORMATS = ['12h', '24h'];
// const REFRESH = ['Every 1 minute', 'Every 5 minutes', 'Every 10 minutes', 'Every 30 minutes'];

class InterfaceForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    handleSubmit: PropTypes.func.isRequired,
    requestSettings: PropTypes.func.isRequired,
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
      fr_FR: __('settings.interface.language.options.fr'),
      en_EN: __('settings.interface.language.options.en'),
    };
  }

  render() {
    const { errors, __ } = this.props;
    const languageOptions = this.getOptionsFromArray(LANGUAGES);
    const timeZoneOptions = this.getOptionsFromArray(TIMEZONES);
    const dateFormatOptions = this.getOptionsFromArray(DATE_FORMATS);
    // const refreshOptions = this.getOptionsFromArray(REFRESH, settings.refresh);

    return (
      <FormGrid className="m-interface-form">
        <form method="post" name="interface_form" onSubmit={this.handleSubmit}>
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
                name="default_language"
                label={__('settings.interface.language.label')}
                options={languageOptions}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" bottomSpace >
              <Field
                component={SelectFieldGroup}
                name="default_timezone"
                label={__('settings.interface.time_zone.label')}
                options={timeZoneOptions}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" bottomSpace>
              <Field
                component={SelectFieldGroup}
                name="date_format"
                label={__('settings.interface.date_format.label')}
                options={dateFormatOptions}
              />
            </FormColumn>
          </FormRow>
          {/* <FormRow>
            <FormColumn size="shrink" bottomSpace >
              <Field
                component={SelectFieldGroup}
                name="refresh"
                value={settings.refresh}
                onChange={this.handleInputChange}
                label={__('settings.interface.refresh.label')}
                options={refreshOptions}
              />
            </FormColumn>
          </FormRow> */}
          <FormRow>
            <FormColumn size="shrink" className="m-interface-form__action" bottomSpace>
              <Button
                type="submit"
                onClick={this.handleSubmit}
                shape="plain"
              >{__('settings.interface.update.action')}</Button>
            </FormColumn>
          </FormRow>
        </form>
      </FormGrid>
    );
  }
}

export default InterfaceForm;
