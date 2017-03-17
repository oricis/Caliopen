import React, { PropTypes } from 'react';
import Button from '../../../Button';

const MessageActions = ({ __, isActive, ...props }) => {
  if (!isActive) {
    return (<div {...props} />);
  }

  return (
    <div {...props}>
      <Button plain className="m-message-item-actions-container__action">{__('Reply')}</Button>
      <Button plain className="m-message-item-actions-container__action">{__('Copy To')}</Button>
      <Button plain className="m-message-item-actions-container__action">{__('Tags')}</Button>
      <Button plain className="m-message-item-actions-container__action">{__('Delete')}</Button>
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
