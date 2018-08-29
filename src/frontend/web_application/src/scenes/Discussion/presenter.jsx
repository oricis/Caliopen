import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { Trans } from 'lingui-react';
import { Button } from '../../components';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import MessageList from './components/MessageList';
import ReplyForm from '../MessageList/components/ReplyForm';
import ReplyExcerpt from '../MessageList/components/ReplyExcerpt';
import { withCloseTab } from '../../modules/tab';

import './style.scss';

const LOAD_MORE_THROTTLE = 1000;

@withCloseTab()
class Discussion extends Component {
  static propTypes = {
    requestMessages: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    discussion: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}),
    scrollToTarget: PropTypes.function,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    hash: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    setMessageRead: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    draft: PropTypes.shape({}),
    currentTab: PropTypes.shape({}),
    closeTab: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentTab: {},
    scrollToTarget: undefined,
    hash: undefined,
    messages: [],
    draft: {},
    user: undefined,
  };

  componentDidMount() {
    const { discussionId } = this.props;
    this.props.requestMessages({ discussion_id: discussionId });
  }

  componentWillReceiveProps(nextProps) {
    const {
      didInvalidate, isFetching, messages, currentTab,
    } = nextProps;
    if (didInvalidate && !isFetching) {
      this.props.requestMessages({ discussion_id: nextProps.discussionId });
    }

    this.throttledLoadMore = throttle(
      () => this.props.loadMore(),
      LOAD_MORE_THROTTLE,
      { trailing: false }
    );

    if (!didInvalidate && !isFetching && messages.length === 0) {
      this.props.closeTab({ currentTab });
    }
  }

  handleDeleteMessage = ({ message }) => {
    this.props.deleteMessage({ message })
      .then(() => {
        if (this.props.messages.length === 0) {
          this.props.closeTab();
        }
      });
  }

  handleSetMessageRead = ({ message }) => {
    this.props.setMessageRead({ message, isRead: true });
  };

  handleSetMessageUnread = ({ message }) => {
    this.props.setMessageRead({ message, isRead: false });
  }

  loadMore = () => {
    const { hasMore, isFetching } = this.props;

    if (!isFetching && hasMore) {
      this.throttledLoadMore();
    }
  }

  renderLoadMore() {
    const { hasMore, isFetching } = this.props;

    return (!isFetching && hasMore) && (
      <Button shape="hollow" onClick={this.loadMore}><Trans id="general.action.load_more">Load more</Trans></Button>
    );
  }

  render() {
    const {
      discussionId, messages, isFetching, hash, scrollToTarget,
      user,
    } = this.props;

    return (
      <section id={`discussion-${discussionId}`} className="s-discussion">
        <StickyNavBar className="action-bar" stickyClassName="sticky-action-bar">
          <header className="s-discussion__header">
            <strong>Discussion complète&thinsp;:</strong>
            <Button className="m-message-list__action" icon="reply">Répondre</Button>
            <Button className="m-message-list__action" icon="tags">Tagger</Button>
            <Button className="m-message-list__action" icon="trash">Supprimer</Button>
          </header>
        </StickyNavBar>
        <MessageList
          className="m-message-list"
          messages={messages}
          loadMore={this.renderLoadMore()}
          isFetching={isFetching}
          hash={hash}
          onMessageRead={this.handleSetMessageRead}
          onMessageUnread={this.handleSetMessageUnread}
          onMessageDelete={this.handleDeleteMessage}
          scrollTotarget={scrollToTarget}
          user={user}
        />
        <ReplyForm
          scrollToMe={hash === 'reply' ? scrollToTarget : undefined}
          discussionId={discussionId}
          internalId={discussionId}
          onFocus={this.handleFocusDraft}
          draftFormRef={(node) => { this.replyFormRef = node; }}
        />
        <ReplyExcerpt
          discussionId={discussionId}
          internalId={discussionId}
          onFocus={this.handleFocusDraft}
          draftExcerptRef={(node) => { this.replyExcerptRef = node; }}
        />
      </section>
    );
  }
}

export default Discussion;
