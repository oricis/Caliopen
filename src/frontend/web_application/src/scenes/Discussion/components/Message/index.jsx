import React, { PureComponent } from 'react';
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
class Message extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onMessageRead: PropTypes.func.isRequired,
    onMessageDelete: PropTypes.func.isRequired,
  };

  isMail = () => {
    const { message } = this.props;

    return message.type === 'email';
  }

  render() {
    const { message, onMessageDelete, onMessageRead } = this.props;

    return (this.isMail() ?
      <MailMessage
        message={message}
        onMessageRead={onMessageRead}
        onMessageDelete={onMessageDelete}
      />
      :
      <InstantMessage message={message} onMessageRead={onMessageRead} />
    );
  }
}

export default Message;
