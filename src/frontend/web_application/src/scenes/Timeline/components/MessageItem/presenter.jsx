import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from '../../../../components/Link';
import MessageItemContainer from '../MessageItemContainer';
import AuthorAvatar from '../AuthorAvatar';
import Icon from '../../../../components/Icon';
import TextBlock from '../../../../components/TextBlock';
import Badge from '../../../../components/Badge';
import { renderParticipant } from '../../../../services/message';

import './style.scss';

class MessageItem extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    formatDate: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  renderAuthor() {
    const { message: { participants } } = this.props;
    const author = participants.find(participant => participant.type === 'From');

    return renderParticipant(author);
  }

  renderTags() {
    const { message } = this.props;

    return message.tags && message.tags.map(tag => (
      <span key={tag.name}>
        {' '}
        <Badge className="s-message-item__tag">{tag.name}</Badge>
      </span>
    ));
  }

  render() {
    const { message, formatDate, __ } = this.props;

    return (
      <MessageItemContainer message={message} __={__}>
        <Link
          to={`/discussions/${message.discussion_id}`}
          className={classnames('s-message-item', { 's-message-item--unread': message.is_unread, 's-message-item--draft': message.is_draft })}
          noDecoration
        >
          <div className="s-message-item__col-avatars">
            <AuthorAvatar message={message} />
          </div>
          <div className="s-message-item__col-title">
            <TextBlock>
              {this.renderAuthor()}
              {this.renderTags()}
            </TextBlock>
            <TextBlock>{message.excerpt}</TextBlock>
          </div>
          <div className="s-message-item__col-file">
            { message.attachments && <Icon type="paperclip" /> }
          </div>
          <div className="s-message-item__col-dates">
            <time
              title={formatDate(message.date_insert, 'LLL')}
              dateTime={formatDate(message.date_insert, '')}
            >
              <TextBlock inline>{formatDate(message.date_insert, 'll')}</TextBlock>
              {' '}
              <TextBlock inline>{formatDate(message.date_insert, 'LT')}</TextBlock>
            </time>
          </div>
        </Link>
      </MessageItemContainer>
    );
  }
}

export default MessageItem;
