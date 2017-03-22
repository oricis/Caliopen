import React, { PropTypes } from 'react';
import Button from '../../../Button';
import Icon from '../../../Icon';


import './style.scss';

const MessageActions = ({ __, isActive, ...props }) => {
  if (!isActive) {
    return (<div {...props} />);
  }

  return (
    <div {...props}>
      <div className="m-message-item-actions-container__actions">
        <Button plain className="m-message-item-actions-container__action"><Icon type="reply" spaced />{__('Reply')}</Button>
        <Button plain className="m-message-item-actions-container__action"><Icon type="share" spaced />{__('Copy To')}</Button>
        <Button plain className="m-message-item-actions-container__action"><Icon type="tags" spaced />{__('Tags')}</Button>
        <Button plain className="m-message-item-actions-container__action"><Icon type="trash" spaced />{__('Delete')}</Button>
      </div>
    </div>
  );
};

MessageActions.propTypes = {
  isActive: PropTypes.bool,
  __: PropTypes.func.isRequired,
};

MessageActions.defaultProps = {
  isActive: false,
};

export default MessageActions;
