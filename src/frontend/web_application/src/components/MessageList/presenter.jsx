import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import MenuBar from '../MenuBar';
import DayMessageList from './components/DayMessageList';
import Message from './components/Message';
import groupMessages from './services/groupMessages';

import './style.scss';

const renderDayGroups = (messages, onMessageView, onMessageDelete, __) => {
  const messagesGroupedByday = groupMessages(messages);

  return Object.keys(messagesGroupedByday)
    .map(date => (
      <DayMessageList key={date} date={date}>
        {messagesGroupedByday[date].map(message => (
          <Message
            key={message.message_id}
            message={message}
            className="m-message-list__message"
            onView={onMessageView}
            onDelete={onMessageDelete}
            __={__}
          />
        ))}
      </DayMessageList>
    ));
};

const MessageList = ({
  onMessageView, onMessageDelete, onReply, onForward, onDelete, messages, replyForm, __,
}) => (
  <div className="m-message-list">
    <MenuBar>
      <Button className="m-message-list__action" onClick={onReply} icon="reply" responsive="icon-only" >{__('message-list.action.reply')}</Button>
      <Button className="m-message-list__action" onClick={onForward} icon="share" responsive="icon-only" >{__('message-list.action.copy-to')}</Button>
      <Button className="m-message-list__action" onClick={onDelete} icon="trash" responsive="icon-only" >{__('message-list.action.delete')}</Button>
    </MenuBar>
    <div className="m-message-list__list">
      {renderDayGroups(messages, onMessageView, onMessageDelete, __)}
    </div>
    <div className="m-message-list__reply">
      {replyForm}
    </div>
  </div>
);

MessageList.propTypes = {
  onMessageView: PropTypes.func,
  onMessageDelete: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  onForward: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  replyForm: PropTypes.node.isRequired,
  __: PropTypes.func.isRequired,
};

MessageList.defaultProps = {
  onMessageView: null,
};

export default MessageList;
