import { Component } from 'react';
import PropTypes from 'prop-types';

class MessageNotifications extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    removeNotifications: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape({})),
  };

  static defaultProps = {
    notifications: [],
  };

  makeHandleClearNotifications = notifications => () => {
    const { removeNotifications } = this.props;

    removeNotifications(notifications);
  }

  render() {
    const { render, notifications } = this.props;

    return render({
      notifications,
      clearNotifications: this.makeHandleClearNotifications(notifications),
    });
  }
}

export default MessageNotifications;
