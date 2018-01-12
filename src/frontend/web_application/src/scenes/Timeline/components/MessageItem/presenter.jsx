import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Moment from 'react-moment';
import { Trans } from 'lingui-react';
import Link from '../../../../components/Link';
import MessageDate from '../../../../components/MessageDate';
import AuthorAvatar from '../../../../components/AuthorAvatar';
import MessageItemContainer from '../MessageItemContainer';
import Icon from '../../../../components/Icon';
import TextBlock from '../../../../components/TextBlock';
import Badge from '../../../../components/Badge';
import { getTagLabelFromName } from '../../../../modules/tags';
import { renderParticipant, getAuthor } from '../../../../services/message';

import './style.scss';

class MessageItem extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    message: PropTypes.shape({}).isRequired,
    settings: PropTypes.shape({}).isRequired,
    isMessageFromUser: PropTypes.bool.isRequired,
    userTags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  renderAuthor() {
    const author = getAuthor(this.props.message);

    return renderParticipant(author);
  }

  renderDate = () => {
    const { message, settings: { default_locale: locale }, isMessageFromUser } = this.props;
    const hasDate = (isMessageFromUser && message.date)
      || (!isMessageFromUser && message.date_insert);
    const msgDate = isMessageFromUser && !message.is_draft ? message.date : message.date_insert;

    return (
      <div className="s-message-item__col-dates">
        {hasDate &&
          <Moment className="m-message__date" locale={locale} element={MessageDate}>
            {msgDate}
          </Moment>
        }
      </div>
    );
  }

  renderTags() {
    const { userTags, message, i18n } = this.props;

    return message.tags && message.tags.map(name => (
      <span key={name}>
        {' '}
        <Badge className="s-message-item__tag">{getTagLabelFromName(i18n, userTags, name)}</Badge>
      </span>
    ));
  }

  render() {
    const { message } = this.props;
    const hash = message.is_draft ? 'reply' : message.message_id;

    return (
      <MessageItemContainer message={message}>
        <Link
          to={`/discussions/${message.discussion_id}#${hash}`}
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
            <TextBlock>
              {message.is_draft && (<span className="s-message-item__draft-prefix"><Trans id="timeline.draft-prefix">Draft in progress:</Trans></span>)}
              {message.subject && (<span className="s-message-item__subject">{message.subject}</span>)}
              {message.excerpt}
            </TextBlock>
          </div>
          <div className="s-message-item__col-file">
            { message.attachments && <Icon type="paperclip" /> }
          </div>
          {this.renderDate()}
        </Link>
      </MessageItemContainer>
    );
  }
}

export default MessageItem;
