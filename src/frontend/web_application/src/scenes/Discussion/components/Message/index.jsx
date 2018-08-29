import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InstantMessage from '../InstantMessage';
import MailMessage from '../MailMessage';

/**
 * Message Component
 * Renders right Component based on Message type.
 *
 * @extends {PureComponent}
 * @prop {Object} message       - message to render
 * @prop {function} scrollToMe  - provided by scrollManager via parent Component
 */
class Message extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onMessageRead: PropTypes.func.isRequired,
    onMessageUnread: PropTypes.func.isRequired,
    onMessageDelete: PropTypes.func.isRequired,
    scrollToMe: PropTypes.func,
    user: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    scrollToMe: undefined,
  };

  isMail = () => {
    const { message } = this.props;

    return message.type === 'email';
  }

  render() {
    return (this.isMail() ?
      <MailMessage {...this.props} />
      :
      <InstantMessage {...this.props} />
    );
  }
}

export default Message;
