import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button';

import './style.scss';

class MessageActionsContainer extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onDelete: PropTypes.func.isRequired,
    onMessageUnread: PropTypes.func.isRequired,
    onMessageRead: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };

  handleDelete = () => {
    const { message, onDelete } = this.props;
    onDelete({ message });
  };

  handleToggle = () => {
    const { message, onMessageRead, onMessageUnread } = this.props;

    if (message.is_unread) { onMessageRead({ message }); }
    if (!message.is_unread) { onMessageUnread({ message }); }
  }

  render() {
    const { __, message } = this.props;

    return (
      <div className="m-message-actions-container">
        <Button className="m-message-actions-container__action" display="expanded" icon="reply" responsive="icon-only">{__('message-list.message.action.reply')}</Button>
        <Button
          className="m-message-actions-container__action"
          onClick={this.handleDelete}
          icon="trash"
          responsive="icon-only"
          display="expanded"
        >{__('message-list.message.action.delete')}</Button>

        <Button
          className="m-message-actions-container__action"
          display="expanded"
          onClick={this.handleToggle}
        >{message.is_unread ? 'Mark read' : 'Mark unread'}</Button>
      </div>
    );
  }
}

export default MessageActionsContainer;
