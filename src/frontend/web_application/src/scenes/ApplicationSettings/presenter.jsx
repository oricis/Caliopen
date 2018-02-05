import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Section, PageTitle, Button, FieldErrors } from '../../components/';
import InterfaceSettings from './components/InterfaceSettings';
import MessageSettings from './components/MessageSettings';
import ContactSettings from './components/ContactSettings';
import NotificationSettings from './components/NotificationSettings';
import DesktopNotificationSettings from './components/DesktopNotificationSettings';
import './style.scss';

class ApplicationSettings extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    requestSettings: PropTypes.func.isRequired,
    errors: PropTypes.shape({}),
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
    errors: {},
  };

  handleSubmit = (ev) => {
    /* TODO: autosave settings */
    const { handleSubmit, requestSettings } = this.props;

    return handleSubmit(ev).then(requestSettings);
  }

  render() {
    const { errors, i18n } = this.props;

    return (
      <form method="post" className="s-application-settings" name="settings_application_form" onSubmit={this.handleSubmit}>
        <PageTitle />
        {errors.global && errors.global.length !== 0 && (
          <FieldErrors errors={errors.global} />
        )}
        <div className="s-application-settings__col-sections">
          <Section title={i18n._('settings.interface.title', { defaults: 'Customize your interface' })}><InterfaceSettings /></Section>
        </div>
        <div className="s-application-settings__col-sections">
          <Section title={i18n._('settings.message.title', { defaults: 'Messages settings' })}><MessageSettings /></Section>
        </div>
        <div className="s-application-settings__col-sections">
          <Section className="s-application-settings__section" title={i18n._('settings.contact.title', { defaults: 'Contact settings' })}><ContactSettings /></Section>
        </div>
        <div className="s-application-settings__col-sections">
          <Section title={i18n._('settings.notification.title', { defaults: 'Notifications settings' })}><NotificationSettings /></Section>
          <Section title={i18n._('settings.desktop_notification.title', { defaults: 'Desktop notifications settings' })}><DesktopNotificationSettings /></Section>
        </div>

        <div className="s-application-settings__action">
          <Button type="submit" shape="plain">
            <Trans id="settings.presentation.update.action">Save settings</Trans>
          </Button>
        </div>

      </form>
    );
  }
}

export default ApplicationSettings;
