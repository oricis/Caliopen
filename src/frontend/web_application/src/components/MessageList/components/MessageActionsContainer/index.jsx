import React, { PropTypes } from 'react';
import Button from '../../../Button';
import Icon from '../../../Icon';
import './style.scss';

const MessageActions = ({ __, onClick, className, ...props }) => (
  <div {...props} className={className}>
    <Button className="m-message-item-actions-container__action" onClick={onClick}><Icon type="reply" spaced /><span>{__('Reply')}</span></Button>
    <Button className="m-message-item-actions-container__action" onClick={onClick}><Icon type="share" spaced /><span>{__('Copy To')}</span></Button>
    <Button className="m-message-item-actions-container__action" onClick={onClick}><Icon type="tags" spaced /><span>{__('Tags')}</span></Button>
    <Button className="m-message-item-actions-container__action" onClick={onClick}><Icon type="trash" spaced /><span>{__('Delete')}</span></Button>
  </div>
);

MessageActions.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  __: PropTypes.func.isRequired,
};

MessageActions.defaultProps = {
  className: '',
};

export default MessageActions;
