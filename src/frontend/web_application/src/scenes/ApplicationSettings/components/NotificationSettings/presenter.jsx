import React, { Component } from 'react';
import { Trans } from 'lingui-react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup as SelectFieldGroupBase, CheckboxFieldGroup as CheckboxFieldGroupBase } from '../../../../components/form';
import renderReduxField from '../../../../services/renderReduxField';

const SelectFieldGroup = renderReduxField(SelectFieldGroupBase);
const CheckboxFieldGroup = renderReduxField(CheckboxFieldGroupBase);

const MESSAGE_PREVIEW = ['off', 'always'];
const DELAY_DISAPPEAR = [0, 5, 10, 30];

class NotificationForm extends Component {
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
      off: i18n.t`settings.notification.message_preview.options.off`,
      always: i18n.t`settings.notification.message_preview.options.always`,
    };
  }

  render() {
    const { i18n } = this.props;

    const messagePreviewOptions = this.getOptionsFromArray(MESSAGE_PREVIEW);
    const delayDisappearOptions = DELAY_DISAPPEAR.map(delay => ({
      value: delay,
      label: (<Trans id="settings.notification.delay_disappear.options.second" values={{ delay }}>%(delay)s Seconds</Trans>),
    }));

    return (
      <FormGrid className="m-contacts-form">
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={CheckboxFieldGroup}
              name="notification_enabled"
              label={i18n.t`settings.notification.enabled.label`}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={SelectFieldGroup}
              name="notification_message_preview"
              label={i18n.t`settings.notification.message_preview.label`}
              options={messagePreviewOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={CheckboxFieldGroup}
              name="notification_sound_enabled"
              label={i18n.t`settings.notification.sound_enabled.label`}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <Field
              component={SelectFieldGroup}
              name="notification_delay_disappear"
              label={i18n.t`settings.notification.delay_disappear.label`}
              options={delayDisappearOptions}
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default NotificationForm;
