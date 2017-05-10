import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../../Button';
import './style.scss';

const MessageActionsContainer = ({ __, className, ...props }) => {
  const messageActionsContainerClassName = classnames(
    'm-message-actions-container',
    className,
  );

  return (
    <div {...props} className={messageActionsContainerClassName}>
      <Button className="m-message-actions-container__action" icon="reply" responsive="icon-only">{__('message-list.message.action.reply')}</Button>
      <Button className="m-message-actions-container__action" icon="share" responsive="icon-only">{__('message-list.message.action.copy-to')}</Button>
      <Button className="m-message-actions-container__action" icon="tags" responsive="icon-only">{__('message-list.message.action.tags')}</Button>
      <Button className="m-message-actions-container__action" icon="trash" responsive="icon-only">{__('message-list.message.action.delete')}</Button>
    </div>
  );
};

MessageActionsContainer.propTypes = {
  className: PropTypes.string,
  __: PropTypes.func.isRequired,
};

MessageActionsContainer.defaultProps = {
  className: null,
};

export default MessageActionsContainer;
