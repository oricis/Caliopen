import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import classNames from 'classnames';
import VisibilitySensor from 'react-visibility-sensor';
import { isMessageFromUser } from '../../../../services/message';
import { getAveragePI, getPiClass } from '../../../../modules/pi';
import { AuthorAvatarLetter } from '../../../../modules/avatar';

import './style.scss';

const PROTOCOL_ICONS = {
  facebook: 'facebook-square',
  twitter: 'twitter',
  sms: 'phone',
  email: 'envelope',
  default: 'comment',
};

class InstantMessage extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onMessageRead: PropTypes.func.isRequired,
    // XXX: No UI for that
    // onMessageUnread: PropTypes.func.isRequired,
    // onDeleteMessage: PropTypes.func.isRequired,
    user: PropTypes.shape({}).isRequired,
  };

  onVisibilityChange = (isVisible) => {
    const { message, onMessageRead } = this.props;

    if (isVisible) {
      if (message.is_unread) { onMessageRead({ message }); }
    }
  }

  getClassNames = (pi, message) => classNames(
    'instant',
    this.getPiClass(pi),
    { fromUser: isMessageFromUser(message, this.props.user) }
  );

  getProtocolIconType = protocol => PROTOCOL_ICONS[protocol] || 'comment';

  extractAuthor = ({ participants }) => participants.find(participant => participant.type === 'From');

  render() {
    const { message } = this.props;
    const author = this.extractAuthor(message);
    const pi = getAveragePI(message.pi);

    return (
      <article className={`instant ${getPiClass(pi)}`}>
        <header className="from">
          <AuthorAvatarLetter message={message} />
          <i className={`fa fa-${this.getProtocolIconType(message.type)}`} />
          <Moment format="HH:mm">{message.date}</Moment>
        </header>
        <aside className="info">
          <div className="participants">
            <span className="from">{author.label}</span>
            <span className="to">à Vous <i className="fa fa-caret-down" /></span>
          </div>
          <div className="pi">
            <div className="pi-numeric">{Math.round(pi)}</div>
            <div className="progress" role="progressbar">
              <div className="progress-meter" style={{ width: `${pi}%` }} />
            </div>
          </div>
        </aside>
        <div className="content">{message.body}</div>
        <VisibilitySensor onChange={this.onVisibilityChange} scrollCheck scrollThrottle={100} />
      </article>
    );
  }
}

export default InstantMessage;
