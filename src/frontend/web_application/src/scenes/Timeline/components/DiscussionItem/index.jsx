import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import classnames from 'classnames';
// import { withI18n } from '@lingui/react';
import { Badge, Icon, Link } from '../../../../components';
import ParticipantsIconLetter from '../../../../components/ParticipantsIconLetter';
import { getAveragePI, getPiClass } from '../../../../modules/pi';

import './style.scss';

// @withI18n()
class DiscussionItem extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    discussion: PropTypes.shape({
      excerpt: PropTypes.string.isRequired,
      discussion_id: PropTypes.string.isRequired,
      total_count: PropTypes.number.isRequired,
      date_update: PropTypes.string.isRequired,
      last_message_id: PropTypes.string.isRequired,
      unread_count: PropTypes.number.isRequired,
      pi: PropTypes.shape({}).isRequired,
      protocol: PropTypes.string,
    }).isRequired,
    // i18n: PropTypes.shape({}).isRequired,
    onSelectDiscussion: PropTypes.func.isRequired,
    isDiscussionSelected: PropTypes.bool.isRequired,
    // isDeleting: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      contact: PropTypes.shape({ contact_id: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
    settings: PropTypes.shape({ default_locale: PropTypes.string.isRequired }).isRequired,
  };

  static defaultProps = {
    className: undefined,
  };

  onCheckboxChange = (ev) => {
    const { discussion, onSelectDiscussion } = this.props;
    const { checked } = ev.target;

    onSelectDiscussion(checked ? 'add' : 'remove', discussion.discussion_id);
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
    const { settings, className } = this.props;
    const {
      excerpt, discussion_id: discussionId, total_count: total, date_update: date,
      last_message_id: lastMessageId, unread_count: unreadCount, pi, protocol,
    } = this.props.discussion;

    // XXX: discussion does not support pi_message yet
    const piAggregate = getAveragePI(pi);

    // const { isDeleting, isDiscussionSelected, i18n } = this.props;

    const labels = this.buildParticipantsLabels(this.props.discussion);
    const iconProtocol = protocol || 'email';

    return (
      <li
        id={`discussion-${discussionId}`}
        data-nb-messages={total}
        data-date={date}
        className={classnames(
          className,
          's-discussion-item',
          { 's-discussion-item--is-unread': unreadCount > 0 },
          `s-discussion-item--${getPiClass(piAggregate)}`
        )}
      >
        <ParticipantsIconLetter labels={labels} />
        <a className="s-discussion-item__participants">{labels.join(', ')}</a>
        <Link to={`/discussions/${discussionId}#${lastMessageId}`} className="s-discussion-item__message_excerpt">
          {this.renderMessageSubject(this.props.discussion)}
          {' '}
          {excerpt}
        </Link>
        {this.renderTags(this.props.discussion)}
        <span className="s-discussion-item__message-type"><Icon type={iconProtocol} /></span>
        <Moment className="s-discussion-item__message-date" fromNow locale={settings.default_locale}>{date}</Moment>
        {/*
        <div className="s-discussion-item__select">
          <Checkbox
            label={i18n._('message-list.action.select_single_discussion', null,
              { defaults: 'Select/deselect this discussion' })}
            onChange={this.onCheckboxChange}
            id={discussionId}
            checked={isDiscussionSelected}
            disabled={isDeleting}
            showLabelforSr
          />
        </div>
        */}
      </li>
    );
  }
}

export default DiscussionItem;
