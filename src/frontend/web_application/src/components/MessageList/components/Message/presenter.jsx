import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { v1 as uuidV1 } from 'uuid';
import VisibilitySensor from 'react-visibility-sensor'; // https://github.com/joshwnj/react-visibility-sensor
import Moment from 'react-moment';
import ContactAvatarLetter from '../../../ContactAvatarLetter';
import Button from '../../../Button';
import Icon from '../../../Icon';
import TextBlock from '../../../TextBlock';
import MultidimensionalPi from '../../../MultidimensionalPi';
import MessageActionsContainer from '../MessageActionsContainer';

import './style.scss';

const FOLD_HEIGHT = 80; // = .m-message__content--fold height

function generateStateFromProps(props) {
  const { message } = props;

  return {
    isRead: !message.is_unread,
  };
}

class Message extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onMessageRead: PropTypes.func,
    onMessageUnread: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    locale: PropTypes.string,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onMessageRead: null,
    onMessageUnread: null,
    locale: undefined,
  };

  constructor(props) {
    super(props);
    this.dropdownId = uuidV1();
  }

  state = {
    isFold: true,
    isRead: false,
    isTooLong: false,
  };

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentDidMount() {
    setTimeout(this.setContentHeight, 1);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(generateStateFromProps(nextProps));
  }

  onChange = (isVisible) => {
    const { message, onMessageRead } = this.props;
    if (isVisible && !this.state.isRead) { onMessageRead({ message }); }
  }

  setContentHeight = () => {
    const isTooLong = this.divElement.clientHeight > FOLD_HEIGHT;

    this.setState(prevState => ({
      ...prevState,
      isTooLong,
      isFold: isTooLong && prevState.isRead,
    }));
  }

  handleExpandClick = () => {
    this.setState(prevState => ({
      ...prevState,
      isFold: !prevState.isFold,
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
        height: this.state.isFold ? FOLD_HEIGHT : 'auto',
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
    const { message, locale, onDelete, onMessageUnread, onMessageRead, __ } = this.props;
    const author = message.participants.find(participant => participant.type === 'From');
    const typeTranslations = {
      email: __('message-list.message.protocol.email'),
    };

    const topBarClassName = classnames(
      'm-message__top-bar',
      { 'm-message__top-bar--is-unread': !this.state.isRead },
    );

    const subjectClassName = classnames(
      'm-message__subject',
      { 'm-message__subject--is-unread': !this.state.isRead },
    );

    return (
      <div className="m-message" onChange={this.onChange}>
        <div className="m-message__avatar-col">
          <ContactAvatarLetter
            contact={author}
            className="m-message__avatar"
            contactDisplayFormat="address"
          />
        </div>
        <div className="m-message__container">
          <div className={topBarClassName}>
            {message.pi && <MultidimensionalPi pi={message.pi} className="m-message__pi" mini />}
            {author.address && <TextBlock className="m-message__author">{author.address}</TextBlock>}
            {message.type &&
              (<div className="m-message__type">
                <span className="m-message__type-label">
                  {__('message-list.message.by', { type: typeTranslations[message.type] })}
                </span>
                {' '}
                <Icon type={message.type} className="m-message__type-icon" spaced />
              </div>
            )}
            {message.date &&
              <Moment className="m-message__date" format="LT" locale={locale}>
                {message.date}
              </Moment> }

            <MessageActionsContainer
              message={message}
              dropdownId={this.dropdownId}
              onDelete={onDelete}
              onMessageRead={onMessageRead}
              onMessageUnread={onMessageUnread}
              __={__}
            />

          </div>

          <div className={subjectClassName}>
            {message.subject &&
              <TextBlock className="m-message__subject-text">
                {message.subject}
              </TextBlock>
            }
          </div>

          {this.renderMessageContent()}
          <VisibilitySensor onChange={this.onChange} scrollThrottle={100} />

          <div className="m-message__footer">
            {this.state.isTooLong &&
              <Button
                onClick={this.handleExpandClick}
                display="expanded"
                className="m-message__footer-button"
              >
                {this.state.isFold ? __('message-list.message.action.expand') : __('message-list.message.action.collapse')}
              </Button>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
