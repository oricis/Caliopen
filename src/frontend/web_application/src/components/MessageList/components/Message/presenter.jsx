import React, { PropTypes, Component } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import Moment from 'react-moment';
import ContactAvatarLetter from '../../../ContactAvatarLetter';
import Dropdown, { withDropdownControl } from '../../../../components/Dropdown';
import Button from '../../../Button';
import Icon from '../../../Icon';
import MultidimensionalPi from '../../../MultidimensionalPi';

import MessageActionsContainer from '../MessageActionsContainer';

import './style.scss';

const DropdownControl = withDropdownControl(Button);

const PI = { technic: 87, context: 45, comportment: 25 };

const MessageInfosContainer = ({ __, message, author, locale }) => {
  const typeTranslations = {
    email: __('message-list.message.protocol.email'),
  };

  return (
    <div className="m-message__infos-container">
      <div className="m-message__author">{author.address}</div>
      {message.type &&
        (<div className="m-message__type">
          <span className="m-message__type-label">
            {__('message-list.message.by', { type: typeTranslations[message.type] })}
          </span>
          {' '}
          <Icon type={message.type} className="m-message__type-icon" spaced />
        </div>
      )}
      <Moment className="m-message__date" format="LT" locale={locale}>
        {message.date}
      </Moment>
    </div>
  );
};

MessageInfosContainer.propTypes = {
  author: PropTypes.shape({}).isRequired,
  message: PropTypes.shape({}).isRequired,
  locale: PropTypes.string,
  __: PropTypes.func.isRequired,
};
MessageInfosContainer.defaultProps = {
  locale: undefined,
};

class Message extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onView: PropTypes.func,
    locale: PropTypes.string,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onView: null,
    locale: undefined,
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
    const { message, locale, __ } = this.props;
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
            <MultidimensionalPi pi={PI} className="m-message__pi" mini />

            <MessageInfosContainer
              message={message}
              author={author}
              locale={locale}
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
                title={this.state.isExpanded ? __('message-list.message.action.collapse') : __('message-list.message.action.expand')}
              >
                {this.state.isExpanded ? __('message-list.message.action.collapse') : __('message-list.message.action.expand')}
              </Button>
            </div>
          }

        </div>
      </div>
    );
  }
}

export default Message;
