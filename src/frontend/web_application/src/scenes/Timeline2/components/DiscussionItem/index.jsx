import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Badge, Icon, Link, Checkbox } from '../../../../components';
import ParticipantsIconLetter from '../../../../components/ParticipantsIconLetter';

import './style.scss';

/**
 * DiscussionItem
 * Displays an entry in Timeline
 *
 * @extends {PureComponent}
 * @prop {Object} discussion  - discussion data, connected prop
 * @user {Object} user        - user data, connected prop
 */
class DiscussionItem extends PureComponent {
  static propTypes = {
    discussion: PropTypes.shape({
      excerpt: PropTypes.string.isRequired,
      discussion_id: PropTypes.string.isRequired,
      total_count: PropTypes.number.isRequired,
      date_insert: PropTypes.string.isRequired,
      last_message_id: PropTypes.string.isRequired,
      unread_count: PropTypes.number.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      contact: PropTypes.shape({ contact_id: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
  };

  buildParticipantsLabels = ({ participants }) =>
    participants
      .filter(participant => !(participant.contact_ids && participant.contact_ids.some(contactId =>
        contactId === this.props.user.contact.contact_id)))
      .map(participant => participant.label);

  renderMessageSubject = (discussion) => {
    const { last_message_subject: lastMessageSubject } = discussion;

    if (lastMessageSubject) {
      return <strong className="s-discussion-item__message_subject">{lastMessageSubject}</strong>;
    }

    return null;
  }

  renderTags = ({ tags }) => (
    tags && (
      <ul className="s-discussion-item__tags">
        {tags.map(tag => (
          <li key={tag.name} className="s-discussion-item__tag"><Badge>{tag.name}</Badge></li>
        ))}
      </ul>
    )
  );

  render() {
    const {
      excerpt, discussion_id: discussionId, total_count: total, date_insert: date,
      last_message_id: lastMessageId, unread_count: unreadCount,
    } = this.props.discussion;

    const labels = this.buildParticipantsLabels(this.props.discussion);

    return (
      <li
        id={`discussion-${discussionId}`}
        data-nb-messages={total}
        data-date={date}
        className={`s-discussion-item${unreadCount ? ' is-unread' : ''}`}
      >
        <ParticipantsIconLetter labels={labels} />
        <a className="s-discussion-item__participants">{labels.join(', ')}</a>
        <Link to={`/discussions/${discussionId}#${lastMessageId}`} className="s-discussion-item__message_excerpt">
          {this.renderMessageSubject(this.props.discussion)}
          {' '}
          {excerpt}
        </Link>
        {this.renderTags(this.props.discussion)}
        <span className="s-discussion-item__message-type"><Icon type="envelope" /></span>
        <Moment className="s-discussion-item__message-date" fromNow locale="fr">{date}</Moment>
        <div className="s-discussion-item__select">
          <Checkbox label="" />
        </div>
      </li>
    );
  }
}

export default DiscussionItem;
