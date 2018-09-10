import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Trans } from 'lingui-react';
import classnames from 'classnames';
import VisibilitySensor from 'react-visibility-sensor';
import withScrollTarget from '../../../../modules/scroll/hoc/scrollTarget';
import { Button } from '../../../../components';
import MessageAttachments from '../../../MessageList/components/MessageAttachments';
import { getAuthor, getRecipients, isParticipantUser, isUserRecipient } from '../../../../services/message';
import { calcPiValue, getPiClass } from '../../../../services/pi';

import sealedEnvelope from './assets/sealed-envelope.png';
import postalCard from './assets/postal-card.png';

import './style.scss';

@withScrollTarget()
class MailMessage extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onMessageRead: PropTypes.func.isRequired,
    onMessageUnread: PropTypes.func.isRequired,
    onMessageDelete: PropTypes.func.isRequired,
    onOpenTags: PropTypes.func.isRequired,
    onCloseTags: PropTypes.func.isRequired,
    onTagsChange: PropTypes.func.isRequired,
    forwardRef: PropTypes.func,
    user: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    forwardRef: undefined,
  }

  componentDidMount() {
    this.strongSrc = sealedEnvelope;
    this.weakSrc = postalCard;
  }

  onVisibilityChange = (isVisible) => {
    const { message, onMessageRead } = this.props;

    if (isVisible) {
      if (message.is_unread) { onMessageRead({ message }); }
    }
  }

  getPiImg = ({ pi }) => (calcPiValue({ pi }) <= 50 ? postalCard : sealedEnvelope);

  // FIXME: Ugly implenentation.
  getPiQualities = ({ pi }) => {
    /* eslint-disable no-nested-ternary */
    // XXX: temp stuff waiting for actual spec
    const labelFor = aspect => (aspect <= 33 ? 'bad' : aspect <= 66 ? 'warn' : 'ok');
    const iconFor = aspect => (aspect <= 33 ? 'fa-times' : aspect <= 66 ? 'fa-warning' : 'fa-check');
    /* eslint-enable no-nested-ternary */
    const { technic, context, comportment } = pi || { technic: 0, context: 0, comportment: 0 };

    return {
      technic: { label: labelFor(technic), icon: iconFor(technic) },
      context: { label: labelFor(context), icon: iconFor(context) },
      comportment: { label: labelFor(comportment), icon: iconFor(comportment) },
    };
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

  strongSrc = '';
  weakSrc = '';

  formatRecipients = () => {
    const { message, user } = this.props;
    const prefix = (user && isUserRecipient(message, user)) ? 'Vous et ' : '';

    const otherRecipients = getRecipients(message)
      .filter(participant => !isParticipantUser(participant, user))
      .map(participant => participant.label).join(', ');

    return `${prefix}${otherRecipients}`;
  }

  render() {
    const { message, forwardRef, onOpenTags } = this.props;
    const pi = calcPiValue(message);
    const author = getAuthor(message);
    const recipients = this.formatRecipients();
    const piQualities = this.getPiQualities(message);

    return (
      <article id={`message-${message.message_id}`} ref={forwardRef} className={classnames(['s-mail-message', getPiClass(pi)])}>
        <div className="s-mail-message__wrapper">
          <aside className="s-mail-message__info">
            <div className="s-mail-message__pi">
              <div className="s-mail-message__pi-illustration">
                <img src={this.getPiImg(message)} alt="" />
                <ul className="s-mail-message__pi-types">
                  <li className={piQualities.comportment.label}>
                    <i className={`fa ${piQualities.comportment.icon}`} />
                    <span>Expéditeur</span>
                  </li>
                  <li className={piQualities.context.label}>
                    <i className={`fa ${piQualities.context.icon}`} />
                    <span>Départ</span>
                  </li>
                  <li className={piQualities.technic.label}>
                    <i className={`fa ${piQualities.technic.icon}`} />
                    <span>Trajet</span>
                  </li>
                </ul>
              </div>
              <div
                className={classnames(['s-mail-message__pi-progress', `s-mail-message__pi-progress--${getPiClass(pi)}`])}
                role="progressbar"
                aria-valuenow={pi}
                aria-valuemax="100"
                tabIndex="0"
              >
                <div
                  className={classnames('s-mail-message__pi-progress-meter', `s-mail-message__pi-progress-meter--${getPiClass(pi)}`)}
                  style={{ width: `${pi}%` }}
                />
              </div>
              <div className="s-mail-message__pi-numeric">
                <span className="legend">Privacy index&thinsp;:</span>
                <span className="value">{Math.round(pi)}</span>
              </div>
              <p className="s-mail-message__pi-metaphor">
                Dans la vraie vie, ce message serait plus ou moins l&apos;équivalent d&apos;
                une carte postale visible par tous.
              </p>
            </div>
            <div className="from"><span className="direction">De&thinsp;:</span> <a href="">{author.label}</a></div>
            <div className="to"><span className="direction">À&thinsp;:</span> <a href="">{recipients}</a></div>
          </aside>
          <div className="container">
            <header>
              <div className="details">
                <div className="what-who-when">
                  <i className="fa fa-envelope" />&nbsp;
                  <a className="from" href="#">{author.label}</a>&nbsp;
                  <Moment fromNow locale="fr">{message.date}</Moment>
                </div>
                <div className="to">À: <strong>{recipients}</strong></div>
              </div>
              <h2>{message.subject}</h2>
            </header>
            {!message.body_is_plain ? (
              <div className="content" dangerouslySetInnerHTML={{ __html: message.body }} />
            ) : (
              <pre className="content">{message.body}</pre>
            )
            }
            <div className="m-message__attachments">
              <MessageAttachments message={message} />
            </div>
          </div>
          <VisibilitySensor onChange={this.onVisibilityChange} scrollCheck scrollThrottle={100} />
        </div>
        <footer>
          <Button className="m-message-action-container__action" icon="reply">
            <Trans id="message-list.message.action.reply">Reply</Trans>
          </Button>
          <Button onClick={onOpenTags} className="m-message-actions-container__action" icon="tags" responsive="icon-only">
            <Trans id="message-list.message.action.tags">Tags</Trans>
          </Button>
          <Button className="m-message-action-container__action" onClick={this.handleMessageDelete} icon="trash">
            <Trans id="message-list.message.action.delete">Delete</Trans>
          </Button>
          <Button className="m-message-action-container__action" onClick={this.handleToggle}>
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
