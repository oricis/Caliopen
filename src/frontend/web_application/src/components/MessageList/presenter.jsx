import React, { PropTypes } from 'react';
import Button from '../Button';
import ReplyForm from '../ReplyForm';
import DayMessageList from './components/DayMessageList';
import Message from './components/Message';
import groupMessages from './services/groupMessages';

import './style.scss';

const renderDayGroups = (messages, __) => {
  const messagesGroupedByday = groupMessages(messages);

  return Object.keys(messagesGroupedByday)
    .map(date => (
      <DayMessageList key={date} date={date} className="m-message-list__day">
        {messagesGroupedByday[date].map(message => (
          <Message
            key={message.message_id}
            message={message}
            className="m-message-list__message"
            __={__}
          />
        ))}
      </DayMessageList>
    ));
};

const MessageList = ({ onReply, onForward, onDelete, messages, __ }) => (
  <div className="m-message-list">
    <div className="m-message-list__actions">
      <Button onClick={onReply}>{__('Reply')}</Button>
      <Button onClick={onForward}>{__('Copy to')}</Button>
      <Button onClick={onDelete}>{__('Delete')}</Button>
    </div>
    <div className="m-message-list__list">
      {renderDayGroups(messages, __)}
    </div>
    <div className="m-message-list__reply">
      <ReplyForm __={__} />
    </div>
  </div>
);

MessageList.propTypes = {
  onReply: PropTypes.func.isRequired,
  onForward: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  __: PropTypes.func.isRequired,
};

export default MessageList;
