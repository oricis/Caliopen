import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown, { withDropdownControl } from '../../../../components/Dropdown';
import { CheckboxFieldGroup } from '../../../form';
import Button from '../../../Button';
import Icon from '../../../Icon';

import './style.scss';

const DropdownControl = withDropdownControl(Button);

function generateStateFromProps(props) {
  const { message } = props;

  return {
    isRead: !message.is_unread,
  };
}

class MessageActionsContainer extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    dropdownId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onMessageUnread: PropTypes.func.isRequired,
    onMessageRead: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };

  state = {
    isRead: false,
  };

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(generateStateFromProps(nextProps));
  }

  handleDelete = () => {
    const { message, onDelete } = this.props;
    onDelete({ message });
  };

  handleToggle = (event) => {
    const checked = event.target.checked;
    const { message, onMessageRead, onMessageUnread } = this.props;

    if (checked) { onMessageRead({ message }); }
    if (!checked) { onMessageUnread({ message }); }

    this.setState(prevState => ({
      isRead: checked,
      ...prevState,
    }));
  }

  render() {
    const { __, message, dropdownId } = this.props;

    return (
      <div className="m-message-actions-container">
        <DropdownControl toggle={dropdownId} className="m-message__actions-switcher">
          <Icon type="ellipsis-v" />
        </DropdownControl>
        <Dropdown
          id={dropdownId}
          className="m-message__actions-menu"
          position="left"
          closeOnClick
        >
          <Button className="m-message-actions-container__action" icon="reply" responsive="icon-only">{__('message-list.message.action.reply')}</Button>
          <Button className="m-message-actions-container__action" icon="share" responsive="icon-only">{__('message-list.message.action.copy-to')}</Button>
          <CheckboxFieldGroup
            className="m-message-actions-container__action"
            label={message.is_unread ? __('message-list.message.status.unread') : __('message-list.message.status.read')}
            name="isRead"
            checked={!message.is_unread}
            onChange={this.handleToggle}
          />

          <Button onClick={this.handleDelete} className="m-message-actions-container__action" icon="trash" responsive="icon-only">{__('message-list.message.action.delete')}</Button>
        </Dropdown>
      </div>
    );
  }
}

export default MessageActionsContainer;
