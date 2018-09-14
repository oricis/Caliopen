import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import classnames from 'classnames';
import { Trans, withI18n } from 'lingui-react';
import { Badge, Button, Modal } from '../../components';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import MessageList from './components/MessageList';
import ReplyForm from '../MessageList/components/ReplyForm';
import ReplyExcerpt from '../MessageList/components/ReplyExcerpt';
import { withCloseTab } from '../../modules/tab';
import { ManageEntityTags } from '../../modules/tags';
import { addEventListener } from '../../services/event-manager';

import './style.scss';

const LOAD_MORE_THROTTLE = 1000;

@withCloseTab()
@withI18n()
class Discussion extends Component {
  static propTypes = {
    requestMessages: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    discussion: PropTypes.shape({}),
    requestDiscussions: PropTypes.func.isRequired,
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
    updateDiscussionTags: PropTypes.func.isRequired,
    currentTab: PropTypes.shape({}),
    closeTab: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    discussion: undefined,
    currentTab: {},
    scrollToTarget: undefined,
    hash: undefined,
    messages: [],
    user: undefined,
  };

  state = {
    isDraftFocus: false,
    isTagModalOpen: false,
  };

  componentDidMount() {
    const {
      discussionId, requestMessages, getUser, user, isUserFetching,
      discussion, requestDiscussions,
    } = this.props;

    if (!user && !isUserFetching) {
      getUser();
    }

    if (!discussion) {
      requestDiscussions();
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

  handleOpenTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: true,
    }));
  };

  handleCloseTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: false,
    }));
  };

  handleFocusDraft = () => {
    this.setState({
      isDraftFocus: true,
    });
  };

  handleDeleteMessage = ({ message }) => {
    const {
      deleteMessage, messages, closeTab, currentTab,
    } = this.props;

    deleteMessage({ message })
      .then(() => {
        if (messages.length === 0) {
          closeTab({ tab: currentTab });
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

  handleTagsChange = async ({ tags }) => {
    const { i18n, messages, updateDiscussionTags } = this.props;

    return updateDiscussionTags({ i18n, messages, tags });
  }

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

  renderTags = ({ tags }) => (
    tags && (
      <ul className="s-discussion__tags">
        {tags.map(tag => (
          <li key={tag.name} className="s-discussion__tag"><Badge>{tag.name}</Badge></li>
        ))}
      </ul>
    )
  );

  renderTagModal = () => {
    const { discussion, i18n } = this.props;
    const nb = (discussion && discussion.tags) ? discussion.tags.length : 0;
    const title = (
      <Trans
        id="tags.header.title"
        defaults={'Tags <0>(Total: {nb})</0>'}
        values={{ nb }}
        components={[
          (<span className="m-tags-form__count" />),
        ]}
      />
    );

    return (
      <Modal
        isOpen={this.state.isTagModalOpen}
        contentLabel={i18n._('tags.header.label', { defaults: 'Tags' })}
        title={title}
        onClose={this.handleCloseTags}
      >
        <ManageEntityTags type="discussion" entity={discussion} onChange={this.handleTagsChange} />
      </Modal>
    );
  }

  render() {
    const {
      discussionId, messages, isFetching, hash, scrollToTarget,
      hasMore, user, isUserFetching, discussion,
    } = this.props;

    return (
      <section id={`discussion-${discussionId}`} className="s-discussion">
        <StickyNavBar className="action-bar" stickyClassName="sticky-action-bar">
          <header className="s-discussion__header">
            {discussion ? this.renderTags(discussion) : null}
            <div className="s-discussions__actions">
              <strong>Discussion complète&thinsp;:</strong>
              <Button className="m-message-list__action" icon="reply">Reply</Button>
              <Button className="m-message-list__action" icon="tags" onClick={this.handleOpenTags}>Tag</Button>
              <Button className="m-message-list__action" icon="trash" onClick={this.handleDeleteAll}>Delete</Button>
            </div>
          </header>
        </StickyNavBar>
        {this.renderTagModal()}
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
