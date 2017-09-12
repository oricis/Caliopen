import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import Notification, { isSupported, PERMISSION_DENIED, PERMISSION_GRANTED } from '../../../../services/browser-notification';

class DesktopNotificationSettings extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
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
    const { __ } = this.props;

    return new Notification(__('settings.desktop_notification.feedback.enabled'));
  }

  renderNoSupport() {
    const { __ } = this.props;

    return (
      <div>
        {__('settings.desktop_notification.no_support')}
      </div>
    );
  }

  renderNotification() {
    const { __ } = this.props;
    if (this.state.hasBrowserNotificationPermission === PERMISSION_GRANTED) {
      return (
        <div>
          {__('settings.desktop_notification.desktop_notifications_enabled')}{' '}
          <Button
            onClick={this.handleClickTestBrowser}
          >
            {__('settings.desktop_notification.action.test_desktop_notification')}
          </Button>
        </div>
      );
    }

    if (this.state.hasBrowserNotificationPermission === PERMISSION_DENIED) {
      return (<div>{__('settings.desktop_notification.disabled')}</div>);
    }

    return (
      <div>
        <Button onClick={this.handleRequestBrowserNotification}>
          {__('settings.desktop_notification.action.request-desktop_notification_permission')}
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
