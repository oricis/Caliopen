import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../Button';

import './style.scss';

class DraftMessageActionsContainer extends Component {
  static propTypes = {
    internalId: PropTypes.string,
    message: PropTypes.shape({}),
    onDelete: PropTypes.func.isRequired,
    onEditTags: PropTypes.func.isRequired,
    className: PropTypes.string,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    internalId: undefined,
    message: undefined,
    className: null,
  };

  state = {
    isRead: false,
  }

  makeHandle = action => () => {
    const { message, internalId } = this.props;
    action({ message, internalId });
  };

  render() {
    const { message, onDelete, onEditTags, className, __ } = this.props;
    const messageActionsContainerClassName = classnames(
      'm-message-actions-container',
      className,
    );

    return (
      <div className={messageActionsContainerClassName}>
        <Button
          onClick={this.makeHandle(onEditTags)}
          className="m-message-actions-container__action"
          icon="tags"
          responsive="icon-only"
        >{__('message-list.message.action.tags')}</Button>
        <Button
          onClick={this.makeHandle(onDelete)}
          className="m-message-actions-container__action"
          icon="trash"
          responsive="icon-only"
          disabled={!message || !message.message_id}
        >{__('message-list.message.action.delete')}</Button>
      </div>
    );
  }
}

export default DraftMessageActionsContainer;
