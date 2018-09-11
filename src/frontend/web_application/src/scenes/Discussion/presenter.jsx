import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import classnames from 'classnames';
import { Button } from '../../components';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import MessageList from './components/MessageList';
import ReplyForm from '../MessageList/components/ReplyForm';
import ReplyExcerpt from '../MessageList/components/ReplyExcerpt';
import { withCloseTab } from '../../modules/tab';
import { addEventListener } from '../../services/event-manager';

import './style.scss';

const LOAD_MORE_THROTTLE = 1000;

@withCloseTab()
class Discussion extends Component {
  static propTypes = {
    requestMessages: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    user: PropTypes.shape({}),
    isUserFetching: PropTypes.bool.isRequired,
    scrollToTarget: PropTypes.function,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    hash: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    onMessageReply: PropTypes.func.isRequired,
    setMessageRead: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    deleteDiscussion: PropTypes.func.isRequired,
    currentTab: PropTypes.shape({}),
    closeTab: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentTab: {},
    scrollToTarget: undefined,
    hash: undefined,
    messages: [],
    user: undefined,
  };

  state = {
    isDraftFocus: false,
  };

  componentDidMount() {
    const {
      discussionId, requestMessages, getUser, user, isUserFetching,
    } = this.props;

    if (!user && !isUserFetching) {
      getUser();
    }

    requestMessages({ discussion_id: discussionId });

    this.throttledLoadMore = throttle(
      () => this.props.loadMore(),
      LOAD_MORE_THROTTLE,
      { trailing: false }
    );

    this.unsubscribeClickEvent = addEventListener('click', (ev) => {
      const { target } = ev;
      const testClick = (tg, node) => node === tg || node.contains(tg);

      if (
        !(this.replyFormRef && testClick(target, this.replyFormRef)) &&
        !(this.replyExcerptRef && testClick(target, this.replyExcerptRef))
      ) {
        if (this.state.isDraftFocus) {
          ev.preventDefault();
        }
        this.setState({
          isDraftFocus: false,
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { didInvalidate, isFetching } = nextProps;

    if (didInvalidate && !isFetching) {
      this.props.requestMessages({ discussion_id: nextProps.discussionId });
    }
  }

  handleFocusDraft = () => {
    this.setState({
      isDraftFocus: true,
    });
  };

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

  handleMessageReply = ({ message }) => {
    this.props.onMessageReply({ message });
    this.props.push('reply');
  };

  loadMore = () => {
    const { hasMore, isFetching } = this.props;

    if (!isFetching && hasMore) {
      this.throttledLoadMore();
    }
  }

  handleDeleteAll = async () => {
    const {
      messages, deleteDiscussion, discussionId, // closeTab, currentTab,
    } = this.props;

    // FIXME : only deletes fetched messages.
    deleteDiscussion({ discussionId, messages });
    //  .then(() => closeTab({ tab: currentTab }));
  };


  render() {
    const {
      discussionId, messages, isFetching, hash, scrollToTarget,
      hasMore, user, isUserFetching,
    } = this.props;

    return (
      <section id={`discussion-${discussionId}`} className="s-discussion">
        <StickyNavBar className="action-bar" stickyClassName="sticky-action-bar">
          <header className="s-discussion__header">
            <strong>Discussion complète&thinsp;:</strong>
            <Button className="m-message-list__action" icon="reply">Reply</Button>
            <Button className="m-message-list__action" icon="tags">Tag</Button>
            <Button className="m-message-list__action" icon="trash" onClick={this.handleDeleteAll}>Delete</Button>
          </header>
        </StickyNavBar>
        <MessageList
          className="m-message-list"
          messages={messages}
          loadMore={this.loadMore}
          hasMore={hasMore}
          isFetching={isFetching}
          hash={hash}
          onMessageRead={this.handleSetMessageRead}
          onMessageUnread={this.handleSetMessageUnread}
          onMessageDelete={this.handleDeleteMessage}
          scrollTotarget={scrollToTarget}
          user={user}
          isUserFetching={isUserFetching}
        />
        <div className={classnames('s-discussion__reply', { 's-discussion__reply--open': this.state.isDraftFocus })}>
          <ReplyForm
            scrollToMe={hash === 'reply' ? scrollToTarget : undefined}
            discussionId={discussionId}
            internalId={discussionId}
            onFocus={this.handleFocusDraft}
            draftFormRef={(node) => { this.replyFormRef = node; }}
          />
        </div>
        <div className={classnames('s-discussion__reply-excerpt', { 's-discussion__reply-excerpt--close': this.state.isDraftFocus })}>
          <ReplyExcerpt
            discussionId={discussionId}
            internalId={discussionId}
            onFocus={this.handleFocusDraft}
            draftExcerptRef={(node) => { this.replyExcerptRef = node; }}
          />
        </div>
      </section>
    );
  }
}

export default Discussion;
