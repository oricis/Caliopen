import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { DateTime } from '@gandi/react-translate';
import ContactAvatarLetter from '../../../ContactAvatarLetter';
import Icon from '../../../Icon';
import MessageActionsContainer from '../MessageActionsContainer';

import './style.scss';

class Message extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { isActive: false };
    this.handleHover = this.handleHover.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleHover() {
    this.setState({ isActive: true });
  }

  handleBlur() {
    this.setState({ isActive: false });
  }

  render() {
    const { message, __ } = this.props;
    const author = message.participants.find(participant => participant.type === 'from');
    const contentClassName = classnames(
      'm-message__content',
      { 'm-message__content--active': this.state.isActive }
    );
    const topBarClassName = classnames(
      'm-message__top-bar',
      { 'm-message__top-bar--active': this.state.isActive }
    );

    return (
      <div
        className="m-message"
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleBlur}
      >
        <MessageActionsContainer className={topBarClassName} isActive={this.state.isActive} __={__}>
          <div className="m-message__date">
            <DateTime format="LT">{message.date_received}</DateTime>
          </div>
          <div className="m-message__type">
            <Icon type={message.type} spaced />{message.type}
          </div>
        </MessageActionsContainer>
        <div className={contentClassName}>
          <div className="m-message__avatar"><ContactAvatarLetter contact={author} /></div>
          <div className="m-message__body">{message.body}</div>
        </div>
      </div>
    );
  }
}

export default Message;
