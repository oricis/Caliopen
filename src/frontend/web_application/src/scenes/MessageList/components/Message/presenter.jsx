import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import VisibilitySensor from 'react-visibility-sensor';
import Moment from 'react-moment';
import { Trans } from 'lingui-react';
import { MultidimensionalPi } from '../../../../modules/pi';
import { Icon, TextBlock } from '../../../../components';
import MessageActionsContainer from '../MessageActionsContainer';
import MessageAttachments from '../MessageAttachments';
import { getAuthor, renderParticipant } from '../../../../services/message';
import './style.scss';

class Message extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onMessageRead: PropTypes.func.isRequired,
    onMessageUnread: PropTypes.func.isRequired,
    updateTagCollection: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onReply: PropTypes.func.isRequired,
    onCopyTo: PropTypes.func.isRequired,
    settings: PropTypes.shape({}).isRequired,
    isMessageFromUser: PropTypes.bool,
    i18n: PropTypes.shape({}).isRequired,
  }

  static defaultProps = {
    isMessageFromUser: false,
  }

  state = {}

  handleTagsChange = async ({ tags }) => {
    const { updateTagCollection, i18n, message: entity } = this.props;

    return updateTagCollection(i18n, { type: 'message', entity, tags });
  }

  renderDate = () => {
    const { message, settings: { default_locale: locale }, isMessageFromUser } = this.props;
    const hasDate = (isMessageFromUser && message.date)
      || (!isMessageFromUser && message.date_insert);

    return (
      <div className="m-message__date">
        {hasDate &&
          <Moment format="LT" locale={locale}>
            {isMessageFromUser ? message.date : message.date_insert}
          </Moment>
        }
      </div>

    );
  }

  renderMessageContent = () => {
    const { message } = this.props;

    const bodyProps = {
      className: classnames(
        'm-message__body',
        { 'm-message__body--rich-text': !message.body_is_plain },
      ),
      ref: (el) => { this.bodyEl = el; },
    };

    return (
      <div className="m-message__content">
        {message.subject &&
          <div className="m-message__subject">{message.subject}</div>
        }
        {!message.body_is_plain ? (
          <div {...bodyProps} dangerouslySetInnerHTML={{ __html: message.body }} />
        ) : (
          <pre {...bodyProps}>{message.body}</pre>
        )
        }
        <div className="m-message__attachments">
          <MessageAttachments message={message} />
        </div>
      </div>
    );
  }

  render() {
    const {
      message, onDelete, onMessageUnread, onMessageRead,
      onReply, onCopyTo, i18n,
    } = this.props;
    const author = getAuthor(message);
    const typeTranslations = {
      email: i18n._('message-list.message.protocol.email', { defaults: 'email' }),
    };

    const messageType = typeTranslations[message.type];

    const participants = message.participants.filter(
      participant => participant.address !== author.address
    );

    return (
      <div id={message.message_id} className="m-message">
        <div className="m-message__info">
          <div className="m-message__pi">
            <Trans className="m-message__info-label" id="message-list.message.pi">Privacy Index</Trans>
            {message.pi && <MultidimensionalPi pi={message.pi} mini />}
          </div>
          <div className="m-message__from">
            <Trans className="m-message__info-label" id="message-list.message.from">From:</Trans>
            {author.address &&
              <TextBlock className="m-message__info-author">{author.address}</TextBlock>
            }
          </div>
        </div>
        <div className="m-message__container">
          <div className="m-message__top-bar">
            {message.is_unread &&
              <span className="m-message__new"><Trans id="message-list.message.new">new</Trans></span>
            }
            {message.type &&
              (<div className="m-message__type">
                <span className="m-message__type-label">
                  <Trans id="message-list.message.by">by {messageType}</Trans>
                </span>
                {' '}
                <Icon type={message.type} className="m-message__type-icon" spaced />
              </div>
            )}
            {this.renderDate()}
            <ul className="m-message__participants">
              {participants.map((participant, index) => (
                <li key={index} className="m-message__participant">
                  {renderParticipant(participant)}
                  {index + 1 !== participants.length && ','}
                </li>
              ))}
            </ul>
          </div>

          {this.renderMessageContent()}
          <VisibilitySensor onChange={this.onChange} scrollCheck scrollThrottle={100} />

          <div className="m-message__footer">
            <MessageActionsContainer
              message={message}
              onDelete={onDelete}
              onMessageRead={onMessageRead}
              onMessageUnread={onMessageUnread}
              onReply={onReply}
              onCopyTo={onCopyTo}
              onTagsChange={this.handleTagsChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
