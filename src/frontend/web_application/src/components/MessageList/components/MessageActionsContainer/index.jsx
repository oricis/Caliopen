import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans } from 'lingui-react';
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
    onReply: PropTypes.func.isRequired,
    onCopyTo: PropTypes.func.isRequired,
    onEditTags: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: null,
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

  makeHandle = action => () => {
    const { message } = this.props;
    action({ message });
  };

  handleReply = () => {
    const { onReply, message } = this.props;
    onReply({ message });
  }

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
    const { onDelete, onCopyTo, onEditTags, className } = this.props;
    const messageActionsContainerClassName = classnames(
      'm-message-actions-container',
      className,
    );

    return (
      <div className={messageActionsContainerClassName}>
        <Button onClick={this.handleReply} className="m-message-actions-container__action" display="expanded" icon="reply" responsive="icon-only"><Trans id="message-list.message.action.reply">message-list.message.action.reply</Trans></Button>
        <Button onClick={this.makeHandle(onCopyTo)} className="m-message-actions-container__action" display="expanded" icon="share" responsive="icon-only"><Trans id="message-list.message.action.copy-to">message-list.message.action.copy-to</Trans></Button>
        <Button onClick={this.makeHandle(onEditTags)} className="m-message-actions-container__action" display="expanded" icon="tags" responsive="icon-only"><Trans id="message-list.message.action.tags">message-list.message.action.tags</Trans></Button>
        <Button onClick={this.makeHandle(onDelete)} className="m-message-actions-container__action" display="expanded" icon="trash" responsive="icon-only"><Trans id="message-list.message.action.delete">message-list.message.action.delete</Trans></Button>
        <Button
          className="m-message-actions-container__action"
          display="expanded"
          onClick={this.handleToggle}
        >
          {!this.state.isRead ? (
            <Trans id="message-list.message.action.mark_as_read">message-list.message.action.mark_as_read</Trans>
          ) : (
            <Trans id="message-list.message.action.mark_as_unread">message-list.message.action.mark_as_unread</Trans>
          )}
        </Button>
      </div>
    );
  }
}

export default MessageActionsContainer;
