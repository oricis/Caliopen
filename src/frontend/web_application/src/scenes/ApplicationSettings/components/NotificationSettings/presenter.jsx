import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup as SelectFieldGroupBase, CheckboxFieldGroup as CheckboxFieldGroupBase } from '../../../../components/form';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);
const CheckboxFieldGroup = renderReduxField(CheckboxFieldGroupBase);

const MESSAGE_PREVIEW = ['off', 'always'];
const DELAY_DISAPPEAR = [0, 5, 10, 30];
const DELAY_DISAPPEAR_UNIT = ['s', 'm'];

class NotificationForm extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
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
    const { __ } = this.props;
    this.i18n = {
      off: __('settings.notification.message_preview.options.off'),
      always: __('settings.notification.message_preview.options.always'),
      s: __('settings.notification.delay_disappear_unit.options.second'),
      m: __('settings.notification.delay_disappear_unit.options.minute'),
    };
  }

  render() {
    const { __ } = this.props;

    const messagePreviewOptions = this.getOptionsFromArray(MESSAGE_PREVIEW);
    const delayDisappearOptions = this.getOptionsFromArray(DELAY_DISAPPEAR);
    const delayDisappearUnitOptions = this.getOptionsFromArray(DELAY_DISAPPEAR_UNIT);

    return (
      <FormGrid className="m-contacts-form">
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={CheckboxFieldGroup}
              name="notification_enabled"
              label={__('settings.notification.enabled.label')}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={SelectFieldGroup}
              name="notification_message_preview"
              label={__('settings.notification.message_preview.label')}
              options={messagePreviewOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={CheckboxFieldGroup}
              name="notification_sound_enabled"
              label={__('settings.notification.sound_enabled.label')}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={SelectFieldGroup}
              name="notification_delay_disappear"
              label={__('settings.notification.delay_disappear.label')}
              options={delayDisappearOptions}
            />
          </FormColumn>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={SelectFieldGroup}
              name="notification_delay_disappear_unit"
              label={__('settings.notification.delay_disappear_unit.label')}
              options={delayDisappearUnitOptions}
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default NotificationForm;
