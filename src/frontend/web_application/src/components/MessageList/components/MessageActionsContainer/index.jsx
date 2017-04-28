import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../../Button';
import Icon from '../../../Icon';
import './style.scss';

const MessageActionsContainer = ({ __, className, ...props }) => {
  const messageActionsContainerClassName = classnames(
    'm-message-actions-container',
    className,
  );

  return (
    <div {...props} className={messageActionsContainerClassName}>
      <Button className="m-message-actions-container__action">
        <Icon type="reply" spaced />
        <span>{__('message-list.message.action.reply')}</span>
      </Button>
      <Button className="m-message-actions-container__action">
        <Icon type="share" spaced />
        <span>{__('message-list.message.action.copy-to')}</span>
      </Button>
      <Button className="m-message-actions-container__action">
        <Icon type="tags" spaced /><span>
          {__('message-list.message.action.tags')}</span>
      </Button>
      <Button className="m-message-actions-container__action">
        <Icon type="trash" spaced /><span>
          {__('message-list.message.action.delete')}</span>
      </Button>
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
