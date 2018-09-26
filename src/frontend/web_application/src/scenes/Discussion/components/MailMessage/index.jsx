import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Trans } from 'lingui-react';
import classnames from 'classnames';
import VisibilitySensor from 'react-visibility-sensor';
import withScrollTarget from '../../../../modules/scroll/hoc/scrollTarget';
import { withPush } from '../../../../modules/routing/hoc/withPush';
import { withTags, getTagLabelFromName } from '../../../../modules/tags';
import { Badge, Button } from '../../../../components';
import MessageAttachments from '../../../MessageList/components/MessageAttachments';
import MessagePi from '../MessagePi';
import { getAuthor, getRecipients, isParticipantUser, isUserRecipient } from '../../../../services/message';
import { getAveragePI, getPiClass } from '../../../../modules/pi/services/pi';

import './style.scss';

@withScrollTarget()
@withPush()
@withTags()
class MailMessage extends Component {
  static propTypes = {
    message: PropTypes.shape({
      message_id: PropTypes.string,
    }).isRequired,
    onMessageRead: PropTypes.func.isRequired,
    onMessageUnread: PropTypes.func.isRequired,
    onMessageDelete: PropTypes.func.isRequired,
    onOpenTags: PropTypes.func.isRequired,
    forwardRef: PropTypes.func,
    user: PropTypes.shape({}).isRequired,
    push: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  static defaultProps = {
    forwardRef: undefined,
  }

  onVisibilityChange = (isVisible) => {
    const { message, onMessageRead } = this.props;

    if (isVisible) {
      if (message.is_unread) { onMessageRead({ message }); }
    }
  }

  handleMessageDelete = () => {
    const { message, onMessageDelete } = this.props;

    onMessageDelete({ message });
  }

  handleToggle = () => {
    const { message, onMessageRead, onMessageUnread } = this.props;

    if (message.is_unread) {
      onMessageRead({ message });
    } else {
      onMessageUnread({ message });
    }
  }

  formatRecipients = () => {
    const { message, user } = this.props;
    const prefix = (user && isUserRecipient(message, user)) ? 'Vous et ' : '';

    const otherRecipients = getRecipients(message)
      .filter(participant => !isParticipantUser(participant, user))
      .map(participant => participant.label).join(', ');

    return `${prefix}${otherRecipients}`;
  }

  renderTags = ({ tags }) => {
    const { i18n, tags: allTags } = this.props;

    return (
      tags && (
        <ul className="s-mail-message__tags">
          {tags.map(tag => (
            <li key={`${this.props.message.message_id}${tag}`} className="s-mail-message__tag">
              <Badge>{getTagLabelFromName(i18n, allTags, tag)}</Badge>
            </li>
          ))}
        </ul>
      )
    );
  };

  render() {
    const { message, forwardRef, onOpenTags } = this.props;
    const pi = getAveragePI(message.pi);
    const author = getAuthor(message);
    const recipients = this.formatRecipients();

    return (
      <article id={`message-${message.message_id}`} ref={forwardRef} className={classnames(['s-mail-message', getPiClass(pi)])}>
        <div className="s-mail-message__wrapper">
          <div className="s-mail-message__details">
            <div className="s-mail-message__details--what-who-when">
              <i className="fa fa-envelope" />&nbsp;
              <a className="s-mail-message__details-from" href="#">{author.label}</a>&nbsp;
              <Moment fromNow locale="fr">{message.date}</Moment>
            </div>
            <div className="s-mail-message__details-to">À: <strong>{recipients}</strong></div>
          </div>
          <aside className="s-mail-message__info">
            <MessagePi pi={message.pi} illustrate describe />
            <div className="s-mail-message__participants">
              <div className="s-mail-message__participants-from"><span className="direction">De&thinsp;:</span> <a href="">{author.label}</a></div>
              <div className="s-mail-message__participants-to"><span className="direction">À&thinsp;:</span> <a href="">{recipients}</a></div>
            </div>
            {this.renderTags(message)}
          </aside>
          <div className="s-mail-message__container">
            <h2 className="s-mail-message__subject">{message.subject}</h2>
            {!message.body_is_plain ? (
              <div className="s-mail-message__content" dangerouslySetInnerHTML={{ __html: message.body }} />
            ) : (
              <pre className="s-mail-message__content">{message.body}</pre>
            )
            }
            <div className="m-message__attachments">
              <MessageAttachments message={message} />
            </div>
          </div>
          <VisibilitySensor onChange={this.onVisibilityChange} scrollCheck scrollThrottle={100} />
        </div>
        <footer className="s-mail-message__actions">
          <Button className="m-message-action-container__action" icon="reply" responsive="icon-only">
            <Trans id="message-list.message.action.reply">Reply</Trans>
          </Button>
          <Button onClick={onOpenTags} className="m-message-actions-container__action" icon="tags" responsive="icon-only">
            <Trans id="message-list.message.action.tags">Tags</Trans>
          </Button>
          <Button className="m-message-action-container__action" onClick={this.handleMessageDelete} icon="trash" responsive="icon-only">
            <Trans id="message-list.message.action.delete">Delete</Trans>
          </Button>
          <Button className="m-message-action-container__action" onClick={this.handleToggle} responsive="icon-only">
            {message.is_unread ? (
              <Trans id="message-list.message.action.mark_as_read">Mark as read</Trans>
            ) : (
              <Trans id="message-list.message.action.mark_as_unread">Mark as unread</Trans>
            )}
          </Button>
        </footer>
      </article>
    );
  }
}

export default MailMessage;
