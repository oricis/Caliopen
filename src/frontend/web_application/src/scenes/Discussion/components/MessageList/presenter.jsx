import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '../../components/Message';
import ProtocolSwitch from '../../components/ProtocolSwitch';
import { calcPiValue } from '../../../../services/pi';

class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.shape([]).isRequired,
    scrollToTarget: PropTypes.func,
    hash: PropTypes.string,
  };

  static defaultProps = {
    scrollToTarget: undefined,
    hash: undefined,
  };

  /**
   * Find message immediately preceding a specific message in discussion.
   * @param {object} - message
   */
  findMessageBefore(message) {
    const { messages } = this.props;
    const index = messages.indexOf(message) - 1;

    return messages[index];
  }

  render() {
    const { messages, hash, scrollToTarget } = this.props;
    const messageList = [];

    return (
      <div className="m-message-list">
        {(messages.length > 0) && messages.reduce((acc, message) => {
          if (message.type !== 'email' && messageList.length > 0
            && this.findMessageBefore(message).type !== message.type) {
            messageList.push(<ProtocolSwitch
              newProtocol={message.type}
              pi={calcPiValue(message)}
              date={message.date}
              key={`switch-${message.message_id}`}
            />);
          }

          messageList.push(<Message
            message={message}
            key={message.message_id}
            scrollToMe={message.message_id === hash ? scrollToTarget : undefined}
          />);

          return messageList;
        }, messageList)}
      </div>
    );
  }
}

export default MessageList;
