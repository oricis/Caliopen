import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/Button';
import Notification, { isSupported, PERMISSION_DENIED, PERMISSION_GRANTED } from '../../services/browser-notification';

class BrowserNotifications extends Component {
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

    return new Notification(__('settings-view.feedback.desktop-notification-enabled'));
  }

  renderNoSupport() {
    const { __ } = this.props;

    return (
      <div>
        {__('settings-view.no-desktop-notification-support')}
      </div>
    );
  }

  renderNotification() {
    const { __ } = this.props;
    if (this.state.hasBrowserNotificationPermission === PERMISSION_GRANTED) {
      return (
        <div>
          {__('settings-view.desktop-notifications-enabled')}{' '}
          <Button
            onClick={this.handleClickTestBrowser}
          >
            {__('settings-view.action.test-desktop-notification')}
          </Button>
        </div>
      );
    }

    if (this.state.hasBrowserNotificationPermission === PERMISSION_DENIED) {
      return (<div>{__('settings-view.desktop-notifications-disabled')}</div>);
    }

    return (
      <div>
        <Button onClick={this.handleRequestBrowserNotification}>
          {__('settings-view.action.request-desktop-notification-permission')}
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

export default BrowserNotifications;
