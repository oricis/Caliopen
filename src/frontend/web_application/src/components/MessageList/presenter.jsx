import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import Icon from '../Icon';
import MenuBar from '../MenuBar';
import DayMessageList from './components/DayMessageList';
import Message from './components/Message';
import groupMessages from './services/groupMessages';

import './style.scss';

const renderDayGroups = (messages, onMessageView, __) => {
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
            __={__}
          />
        ))}
      </DayMessageList>
    ));
};

const MessageList = ({ onMessageView, onReply, onForward, onDelete, messages, replyForm, __ }) => (
  <div className="m-message-list">
    <MenuBar>
      <Button className="m-message-list__action" onClick={onReply}><Icon type="reply" spaced /><span>{__('message-list.action.reply')}</span></Button>
      <Button className="m-message-list__action" onClick={onForward}><Icon type="share" spaced /><span>{__('message-list.action.copy-to')}</span></Button>
      <Button className="m-message-list__action" onClick={onDelete}><Icon type="trash" spaced /><span>{__('message-list.action.delete')}</span></Button>
    </MenuBar>
    <div className="m-message-list__list">
      {renderDayGroups(messages, onMessageView, __)}
    </div>
    <div className="m-message-list__reply">
      {replyForm}
    </div>
  </div>
);

MessageList.propTypes = {
  onMessageView: PropTypes.func,
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
