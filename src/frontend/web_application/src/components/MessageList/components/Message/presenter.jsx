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

const FOLD_HEIGHT = 80; // = .m-message__content--fold height

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
    bodyHeight: null,
    isTooLong: false,
    isFold: true, // set fold state as default to avoid content's height animation on load
  };

  componentDidMount() {
    setTimeout(this.setContentHeight, 1);
  }

  componentDidUpdate() {
    const { message, onView } = this.props;

    if (onView && message.is_unread !== false) {
      onView({ message });
    }
  }

  setContentHeight = () => {
    const { message } = this.props;
    const bodyHeight = this.divElement.clientHeight;
    const isTooLong = bodyHeight > FOLD_HEIGHT;

    this.setState(prevState => ({
      ...prevState,
      bodyHeight,
      isTooLong,
      isFold: isTooLong && !message.is_unread,
    }));
  }

  handleExpandClick = () => {
    const bodyHeight = this.divElement.clientHeight;
    this.setState(prevState => ({
      isFold: !prevState.isFold,
      bodyHeight,
    }));
  }

  renderMessageContent = () => {
    const { message } = this.props;

    const contentProps = {
      className: classnames(
        'm-message__content',
        { 'm-message__content--fold': this.state.isFold },
      ),
      style: {
        height: this.state.isFold ? null : this.state.bodyHeight,
        transitionDuration: `${((this.state.bodyHeight / 100) * 0.05)}s`, // to make 'expand'/'collapse' animation smoother
      },
    };

    const bodyProps = {
      className: classnames(
        'm-message__body',
        { 'm-message__body--rich-text': !message.body_is_plain },
      ),
      ref: (divElement) => { this.divElement = divElement; },
    };

    return (
      <div {...contentProps}>
        {!message.body_is_plain ? (
          <div {...bodyProps} dangerouslySetInnerHTML={{ __html: message.body }} />
        ) : (
          <pre {...bodyProps}>{message.body}</pre>
        )
        }
      </div>
    );
  }

  render() {
    const { message, locale, onDelete, __ } = this.props;
    const author = message.participants.find(participant => participant.type === 'From');
    const subject = message.subject;
    const dropdownId = uuidV1();
    const typeTranslations = {
      email: __('message-list.message.protocol.email'),
    };

    const topBarClassName = classnames(
      'm-message__top-bar',
      { 'm-message__top-bar--is-unread': message.is_unread },
    );

    const subjectClassName = classnames(
      'm-message__subject',
      { 'm-message__subject--is-unread': message.is_unread },
    );

    return (
      <div className="m-message">
        <div className="m-message__avatar-col">
          <ContactAvatarLetter
            contact={author}
            className="m-message__avatar"
            contactDisplayFormat="address"
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
            <TextBlock className={subjectClassName}>
              <Icon type="comments-o" rightSpaced />{subject}
            </TextBlock>
          }

          {this.renderMessageContent()}

          {this.state.isTooLong &&
            <Button
              className="m-message__expand-button"
              onClick={this.handleExpandClick}
              display="expanded"
            >
              {this.state.isFold ? __('message-list.message.action.expand') : __('message-list.message.action.collapse')}
            </Button>
          }
        </div>
      </div>
    );
  }
}

export default Message;
