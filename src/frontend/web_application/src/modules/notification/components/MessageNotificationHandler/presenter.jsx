import { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from '@lingui/react';
import isequal from 'lodash.isequal';
import { withSettings } from '../../../../modules/settings';
import { notify as browserNotify } from '../../../../services/browser-notification';

@withI18n()
@withSettings()
class MessageNotificationHandler extends Component {
  static propTypes = {
    requestDiscussions: PropTypes.func.isRequired,
    requestNewMessages: PropTypes.func.isRequired,
    newMessageIds: PropTypes.arrayOf(PropTypes.string),
    settings: PropTypes.shape({}),
    i18n: PropTypes.shape({ _: PropTypes.func.isRequired }).isRequired,
  };

  static defaultProps = {
    newMessageIds: [],
    settings: undefined,
  };

  state = {
    hasActivity: false,
  };

  componentDidMount() {
    this.handleNotifications(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.hasActivity && !isequal(nextProps.newMessageIds, this.props.newMessageIds)) {
      this.handleNotifications(nextProps);
    }
  }

  handleNotifications = async ({ newMessageIds, settings }) => {
    if (!settings) {
      return;
    }

    if (!newMessageIds || newMessageIds.length === 0) {
      return;
    }

    this.setState({ hasActivity: true });

    try {
      const { requestDiscussions, requestNewMessages } = this.props;

      await requestNewMessages(newMessageIds);
      await requestDiscussions();
    } catch (e) {
      throw e;
    } finally {
      this.setState({ hasActivity: false });
    }

    if (settings.notification_enabled) {
      const { i18n } = this.props;

      // this notify only when document is not visible
      browserNotify({
        message: i18n._('desktop.notification.new_messages', [newMessageIds.length], {
          defaults: 'You received {0} new messages',
        }),
      });
    }
  }

  render() {
    return null;
  }
}

export default MessageNotificationHandler;
