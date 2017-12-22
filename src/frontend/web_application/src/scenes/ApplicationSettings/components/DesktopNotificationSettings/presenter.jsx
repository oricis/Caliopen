import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import Button from '../../../../components/Button';
import Notification, { isSupported, PERMISSION_DENIED, PERMISSION_GRANTED } from '../../../../services/browser-notification';

class DesktopNotificationSettings extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
  };

  state = {
    hasBrowserNotificationSupport: false,
    hasBrowserNotificationEnabled: false,
  };

  componentWillMount() {
    this.setState({
      hasBrowserNotificationSupport: isSupported,
      hasBrowserNotificationPermission: isSupported && Notification.permission,
    });
  }

  handleRequestBrowserNotification = () => {
    Notification.requestPermission(permission => this.setState({
      hasBrowserNotificationPermission: permission,
    }));
  }

  handleClickTestBrowser = () => {
    const { i18n } = this.props;

    return new Notification(i18n._('settings.desktop_notification.feedback.enabled'));
  }

  // eslint-disable-next-line
  renderNoSupport() {
    return (
      <div>
        <Trans id="settings.desktop_notification.no_support">Notifications are not supported by your browser</Trans>
      </div>
    );
  }

  renderNotification() {
    if (this.state.hasBrowserNotificationPermission === PERMISSION_GRANTED) {
      return (
        <div>
          <Trans id="settings.desktop_notification.desktop_notifications_enabled">Desktop notifications enabled</Trans>{' '}
          <Button
            onClick={this.handleClickTestBrowser}
          >
            <Trans id="settings.desktop_notification.action.test_desktop_notification">Check desktop notifications</Trans>
          </Button>
        </div>
      );
    }

    if (this.state.hasBrowserNotificationPermission === PERMISSION_DENIED) {
      return (<div><Trans id="settings.desktop_notification.disabled">Notifications are disabled, please check your browser settings</Trans></div>);
    }

    return (
      <div>
        <Button onClick={this.handleRequestBrowserNotification}>
          <Trans id="settings.desktop_notification.action.request-desktop_notification_permission">Enable desktop notifications</Trans>
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {isSupported ?
          this.renderNotification() :
          this.renderNoSupport()}
      </div>
    );
  }
}

export default DesktopNotificationSettings;
