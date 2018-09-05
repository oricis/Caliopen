import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import VisibilitySensor from 'react-visibility-sensor';
import { calcPiValue } from '../../../../services/pi';
import { AuthorAvatarLetter } from '../../../../modules/avatar';

import './style.scss';

class InstantMessage extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onMessageRead: PropTypes.func.isRequired,
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

  getPiClass = pi => (pi <= 50 ? 'weak-pi' : 'strong-pi');
  extractAuthor = ({ participants }) => participants.find(participant => participant.type === 'From');
  protocolIcon = (protocol) => {
    switch (protocol) {
      case 'facebook':
        return 'facebook-square';
      case 'twitter':
        return 'twitter';
      case 'sms':
        return 'phone';
      case 'email':
        return 'envelope';
      default:
        return 'comment';
    }
  }

  render() {
    const { message } = this.props;
    const author = this.extractAuthor(message);
    const pi = calcPiValue(message);

    return (
      <article className={`instant ${this.getPiClass(pi)}`}>
        <header className="from">
          <AuthorAvatarLetter message={message} />
          <i className={`fa fa-${this.protocolIcon(message.type)}`} />
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
