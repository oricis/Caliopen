import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Button from '../../../../components/Button';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup as SelectFieldGroupBase, CheckboxFieldGroup as CheckboxFieldGroupBase, FieldErrors } from '../../../../components/form';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);
const CheckboxFieldGroup = renderReduxField(CheckboxFieldGroupBase);

const MESSAGE_PREVIEW = ['off', 'always'];
const DELAY_DISAPPEAR = [0, 5, 10, 30];
const DELAY_DISAPPEAR_UNIT = ['s', 'm'];

class NotificationForm extends Component {
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
      off: __('settings.notification.message_preview.options.off'),
      always: __('settings.notification.message_preview.options.always'),
      s: __('settings.notification.delay_disappear_unit.options.second'),
      m: __('settings.notification.delay_disappear_unit.options.minute'),
    };
  }

  render() {
    const { errors, __ } = this.props;

    const messagePreviewOptions = this.getOptionsFromArray(MESSAGE_PREVIEW);
    const delayDisappearOptions = this.getOptionsFromArray(DELAY_DISAPPEAR);
    const delayDisappearUnitOptions = this.getOptionsFromArray(DELAY_DISAPPEAR_UNIT);

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

export default NotificationForm;
