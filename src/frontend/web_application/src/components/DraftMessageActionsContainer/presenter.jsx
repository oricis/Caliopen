import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans } from 'lingui-react';
import Button from '../Button';

import './style.scss';

class DraftMessageActionsContainer extends Component {
  static propTypes = {
    internalId: PropTypes.string,
    message: PropTypes.shape({}),
    onDelete: PropTypes.func.isRequired,
    onEditTags: PropTypes.func.isRequired,
    className: PropTypes.string,
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
    const { message, onDelete, onEditTags, className } = this.props;
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
        ><Trans id="message-list.message.action.tags">message-list.message.action.tags</Trans></Button>
        <Button
          onClick={this.makeHandle(onDelete)}
          className="m-message-actions-container__action"
          icon="trash"
          responsive="icon-only"
          disabled={!message || !message.message_id}
        ><Trans id="message-list.message.action.delete">message-list.message.action.delete</Trans></Button>
      </div>
    );
  }
}

export default DraftMessageActionsContainer;
