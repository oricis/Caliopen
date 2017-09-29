import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button';

import './style.scss';

function generateStateFromProps(props) {
  const { message } = props;

  return { isRead: !message.is_unread };
}

class MessageActionsContainer extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onDelete: PropTypes.func.isRequired,
    onMessageUnread: PropTypes.func.isRequired,
    onMessageRead: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };

  state = {
    isRead: false,
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(generateStateFromProps(nextProps));
  }

  handleDelete = () => {
    const { message, onDelete } = this.props;
    onDelete({ message });
  };

  handleToggle = () => {
    const { message, onMessageRead, onMessageUnread } = this.props;

    if (message.is_unread) { onMessageRead({ message }); }
    if (!message.is_unread) { onMessageUnread({ message }); }

    this.setState(prevState => ({
      ...prevState,
      isRead: !message.is_unread,
    }));
  }

  render() {
    const { __ } = this.props;

    return (
      <div className="m-message-actions-container">
        <Button className="m-message-actions-container__action" display="expanded">{__('message-list.message.action.reply')}</Button>
        <Button
          className="m-message-actions-container__action"
          onClick={this.handleDelete}
          display="expanded"
        >{__('message-list.message.action.delete')}</Button>

        <Button
          className="m-message-actions-container__action"
          display="expanded"
          onClick={this.handleToggle}
        >{!this.state.isRead ? __('message-list.message.action.mark_as_read') : __('message-list.message.action.mark_as_unread')}</Button>
      </div>
    );
  }
}

export default MessageActionsContainer;
