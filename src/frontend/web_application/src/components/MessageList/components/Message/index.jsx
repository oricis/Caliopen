import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { DateTime } from '@gandi/react-translate';
import ContactAvatarLetter from '../../../ContactAvatarLetter';
import Button from '../../../Button';
import Icon from '../../../Icon';
import MessageActionsContainer from '../MessageActionsContainer';

import './style.scss';


const MessageInfosContainer = ({ __, message, author }) => (
  <div className="m-message__infos-container">
    <div className="m-message__author">
      {author.address}</div>
    <div className="m-message__type">
      {__('by')} {message.type} <Icon type={message.type} className="m-message__type-ico" spaced /></div>
    <DateTime className="m-message__date" format="LT">
      {message.date_received}</DateTime>
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
    __: PropTypes.func.isRequired,
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
    this.setState({
      isActive: !this.state.isActive,
    });
  }

  handleExpandClick() {
    const message = this.props.message;
    const body = message.body;
    if (this.state.isExpanded) {
      this.setState({
        isExpanded: false,
        body: body.substring(0, 140),
      });
    } else {
      this.setState({
        isExpanded: true,
        body,
      });
    }
  }

  render() {
    const { message, __ } = this.props;
    const author = message.participants.find(participant => participant.type === 'from');
    const subject = message.subject;
    const headerClassName = classnames(
      'm-message__header',
      { 'm-message__header--active': this.state.isActive }
    );
    const bodyClassName = classnames(
      'm-message__body__content',
      { 'm-message__body__content--expanded': this.state.isExpanded }
    );


    return (
      <div className="m-message">
        <div className="m-message__avatar"><ContactAvatarLetter contact={author} /></div>
        <div className="m-message__content">
          <div className={headerClassName}>
            <div className="m-message__top-bar">
              <MessageInfosContainer
                message={message}
                author={author}
                __={__}
              />
              <MessageActionsContainer
                className="m-message__actions-container"
                onClick={this.handleActiveClick}
                __={__}
              />
            </div>

            <Button
              className="m-message__actions-switcher"
              onClick={this.handleActiveClick}
              value={this.state.isActive}
              title={__('more actions')}
            >
              {this.state.isActive ? <Icon type="ellipsis-v" /> : <Icon type="ellipsis-v" />}
            </Button>
          </div>

          <div className="m-message__body">
            <div className="m-message__body__subject">{subject}</div>
            <div className={bodyClassName}>
              {this.state.body}
            </div>
          </div>

          {this.state.isTooLong &&
            <div className="m-message__expand">
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
