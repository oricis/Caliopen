import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import isequal from 'lodash.isequal';
import { matchPath } from 'react-router-dom';
import { notify as browserNotify } from '../../../../services/browser-notification';

const PATHS_TO_IGNORE = [
  '/',
  // XXX: this requires notification to set a discussion_id: we display app notif only if does not
  // contain new mesg in the discussion
  // '/discussions/:discussionId',
];

class MessageNotifier extends Component {
  static propTypes = {
    notifyInfo: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape({})),
    settings: PropTypes.shape({}),
    i18n: PropTypes.shape({ _: PropTypes.func.isRequired }).isRequired,
    location: PropTypes.shape({}),
  };

  static defaultProps = {
    location: undefined,
    notifications: [],
    settings: undefined,
  };

  state = {};

  componentDidMount() {
    this.handleNotifications(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isequal(nextProps.notifications, this.props.notifications)) {
      this.handleNotifications(nextProps);
    }
  }

  handleNotifications = async ({ notifications, settings, location }) => {
    if (!settings || !location) {
      return;
    }

    if (!notifications || notifications.length === 0) {
      return;
    }

    if (settings.notification_enabled) {
      // this notify only when document is not visible
      const { i18n } = this.props;

      browserNotify({
        message: i18n._('desktop.notification.new_messages', [notifications.length], {
          defaults: 'You received {0} new messages',
        }),
      });
    }

    if (PATHS_TO_IGNORE.some(path => matchPath(location.pathname, {
      path, exact: true, strict: false,
    }))) {
      return;
    }

    const { notifyInfo } = this.props;

    if ((settings.notification_enabled)) {
      // XXX: should be better to display in tabs
      notifyInfo({
        message: (
          <Trans id="app.notification.new_messages" values={[notifications.length]}>
            You received {0} new messages
          </Trans>),
      });
    }
  }

  render() {
    return null;
  }
}

export default MessageNotifier;
