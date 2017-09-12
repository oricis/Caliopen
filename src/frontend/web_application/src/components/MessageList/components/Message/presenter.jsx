import React, { PropTypes, Component } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import Moment from 'react-moment';
import ContactAvatarLetter from '../../../ContactAvatarLetter';
import Dropdown, { withDropdownControl } from '../../../../components/Dropdown';
import Button from '../../../Button';
import Icon from '../../../Icon';
import TextBlock from '../../../TextBlock';
import MultidimensionalPi from '../../../MultidimensionalPi';

import MessageActionsContainer from '../MessageActionsContainer';

import './style.scss';

const DropdownControl = withDropdownControl(Button);

class Message extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onView: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    locale: PropTypes.string,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onView: null,
    locale: undefined,
  };

  state = {
    body: '',
    excerpt: '',
    isExcerpt: false,
    isTooLong: false,
  };

  componentDidMount() {
    this.setBodyHeight();
  }

  componentDidUpdate() {
    const { message, onView } = this.props;

    if (onView && message.is_unread !== false) {
      onView({ message });
    }
  }

  setBodyHeight = () => {
    const message = this.props.message;
    const body = message.body;
    if (body.length > 140) {
      this.setState({
        isTooLong: true,
        isExcerpt: true,
        excerpt: body.substring(0, 140),
      });
    }
  }

  handleExpandClick = () => {
    this.setState(prevState => ({
      isExcerpt: !prevState.isExcerpt,
    }));
  }

  render() {
    const { message, locale, onDelete, __ } = this.props;
    const author = message.participants.find(participant => participant.type === 'From');
    const subject = message.subject;

    const bodyClassName = classnames(
      'm-message__body',
      { 'm-message__body--excerpt': this.state.isExcerpt },
      { 'm-message__body--html': !message.body_is_plain },
    );

    const topBarClassName = classnames(
      'm-message__top-bar',
      { 'm-message__top-bar--new': message.is_unread },
    );

    const dropdownId = uuidV1();
    const typeTranslations = {
      email: __('message-list.message.protocol.email'),
    };

    return (
      <div className="m-message">
        <div className="m-message__avatar-col">
          <ContactAvatarLetter
            contact={author}
            className="m-message__avatar"
          />
        </div>
        <div className="m-message__container">
          <div className={topBarClassName}>
            <MultidimensionalPi pi={message.pi} className="m-message__pi" mini />

            <TextBlock className="m-message__author">{author.address}</TextBlock>
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
                message={message}
                onDelete={onDelete}
              />
            </Dropdown>

          </div>

          {subject &&
            <TextBlock className="m-message__subject">
              <Icon type="comments-o" rightSpaced />{subject}
            </TextBlock>
          }
          {message.body_is_plain ? (
            <pre
              className={bodyClassName}
              dangerouslySetInnerHTML={
                { __html: this.state.isExcerpt ? this.state.excerpt : message.body }
              }
            />
          ) : (
            <div
              className={bodyClassName}
              dangerouslySetInnerHTML={
                { __html: this.state.isExcerpt ? this.state.excerpt : message.body }
              }
            />
            )
          }

          {this.state.isTooLong &&
            <div className="m-message__expand-button">
              <Button
                onClick={this.handleExpandClick}
                value={this.state.isExcerpt}
                display="expanded"
              >
                {this.state.isExcerpt ? __('message-list.message.action.expand') : __('message-list.message.action.collapse')}
              </Button>
            </div>
          }

        </div>
      </div>
    );
  }
}

export default Message;
