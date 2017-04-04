import React, { PropTypes, Component } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import { DateTime } from '@gandi/react-translate';
import ContactAvatarLetter from '../../../ContactAvatarLetter';
import Dropdown, { withDropdownControl } from '../../../../components/Dropdown';
import Button from '../../../Button';
import Icon from '../../../Icon';
import MessageActionsContainer from '../MessageActionsContainer';

import './style.scss';

const DropdownControl = withDropdownControl(Button);

const MessageInfosContainer = ({ __, message, author }) => (
  <div className="m-message__infos-container">
    <div className="m-message__author">{author.address}</div>
    <div className="m-message__type">
      <span className="m-message__type-label">{__('by')} {message.type}</span>
      {' '}
      <Icon type={message.type} className="m-message__type-icon" spaced />
    </div>
    <DateTime className="m-message__date" format="LT">
      {message.date}
    </DateTime>
  </div>
);

MessageInfosContainer.propTypes = {
  author: PropTypes.shape({}).isRequired,
  message: PropTypes.shape({}).isRequired,
  __: PropTypes.func.isRequired,
};

class Message extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onView: PropTypes.func,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onView: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      body: '',
      isExpanded: true,
      isTooLong: false,
      isActive: false,
    };
    this.handleActiveClick = this.handleActiveClick.bind(this);
    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  componentDidMount() {
    this.setBodyHeight();
  }

  componentDidUpdate() {
    const { message, onView } = this.props;

    if (onView && message.is_unread !== false) {
      onView({ message });
    }
  }

  setBodyHeight() {
    const message = this.props.message;
    const body = message.body;
    if (body.length > 140) {
      this.setState({
        isTooLong: true,
        isExpanded: false,
        body: body.substring(0, 140),
      });
    } else {
      this.setState({
        body,
      });
    }
  }

  handleActiveClick() {
    this.setState(prevState => ({
      isActive: !prevState.isActive,
    }));
  }

  handleExpandClick() {
    const message = this.props.message;
    const body = message.body;
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
      body: prevState.isExpanded ? body.substring(0, 140) : body,
    }));
  }

  render() {
    const { message, __ } = this.props;
    const author = message.participants.find(participant => participant.type === 'From');
    const subject = message.subject;
    const topBarClassName = classnames(
      'm-message__top-bar',
      { 'm-message__top-bar--active': this.state.isActive }
    );
    const bodyClassName = classnames(
      'm-message__body__content',
      { 'm-message__body__content--expanded': this.state.isExpanded }
    );

    const dropdownId = uuidV1();

    return (
      <div className="m-message">
        <div className="m-message__avatar-col">
          <ContactAvatarLetter
            contact={author}
            className="m-message__avatar"
          />
        </div>
        <div className="m-message__content">

          <div className={topBarClassName}>
            <MessageInfosContainer
              message={message}
              author={author}
              __={__}
            />

            <DropdownControl toggle={dropdownId} className="m-message__actions-switcher">
              <Icon type="ellipsis-v" />
            </DropdownControl>

            <Dropdown
              id={dropdownId}
              className="m-message__actions-menu"
              position="left"
              closeOnClick
            >
              <MessageActionsContainer
                className="m-message__actions-container"
                __={__}
              />
            </Dropdown>

          </div>

          <div className="m-message__body">
            {subject &&
              <div className="m-message__body__subject">{subject}</div>
            }
            <div className={bodyClassName}>
              {this.state.body}
            </div>
          </div>

          {this.state.isTooLong &&
            <div className="m-message__expand-button">
              <Button
                onClick={this.handleExpandClick}
                value={this.state.isExpanded}
                title={this.state.isExpanded ? __('Collaspse') : __('Expand')}
              >
                {this.state.isExpanded ? __('Collaspse') : __('Expand')}
              </Button>
            </div>
          }

        </div>
      </div>
    );
  }
}

export default Message;
