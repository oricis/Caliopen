import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
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
@withRouter
class Discussion extends Component {
  static propTypes = {
    loadMore: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    discussion: PropTypes.shape({}),
    requestDiscussion: PropTypes.func.isRequired,
    user: PropTypes.shape({}),
    isUserFetching: PropTypes.bool.isRequired,
    scrollToTarget: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    location: PropTypes.shape({}).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    onMessageReply: PropTypes.func.isRequired,
    onMessageSent: PropTypes.func.isRequired,
    setMessageRead: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    // XXX: waiting for API
    // deleteDiscussion: PropTypes.func.isRequired,
    // updateDiscussionTags: PropTypes.func.isRequired,
    closeTab: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  static defaultProps = {
    discussion: undefined,
    messages: [],
    user: undefined,
  };

  state = {
    isDraftFocus: false,
    isTagModalOpen: false,
    initialized: false,
  };

  componentDidMount() {
    const {
      getUser, user, isUserFetching, requestDiscussion, isFetching,
    } = this.props;

    if (!user && !isUserFetching) {
      getUser();
    }

    if (!this.state.initialized && !isFetching) {
      requestDiscussion().then(() => {
        this.setState({
          initialized: true,
        }, () => {
          this.eventuallyCloseTab();
        });
      });
    }

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
    const {
      didInvalidate, isFetching,
    } = nextProps;

    if (didInvalidate && !isFetching) {
      this.props.requestDiscussion()
        .then(() => this.eventuallyCloseTab());
    }
  }

  componentWillUnmount() {
    this.unsubscribeClickEvent();
  }

  eventuallyCloseTab = () => {
    const { isFetching, messages, closeTab } = this.props;

    if (this.state.initialized && !isFetching && messages.length === 0) {
      closeTab();
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

  handleDeleteMessage = async ({ message }) => {
    const { deleteMessage } = this.props;

    await deleteMessage({ message });
    this.eventuallyCloseTab();
  };

  handleSetMessageRead = ({ message }) => {
    this.props.setMessageRead({ message, isRead: true });
  };

  handleSetMessageUnread = ({ message }) => {
    this.props.setMessageRead({ message, isRead: false });
  };

  handleMessageReply = () => {
    const { messages, onMessageReply, push } = this.props;
    const message = messages[messages.length - 1];

    onMessageReply({ message });
    push({ hash: 'reply' });
  };

  handleTagsChange = async ({ tags }) => {
    const { i18n, messages, updateDiscussionTags } = this.props;

    return updateDiscussionTags({ i18n, messages, tags });
  };

  handleMessageSent = message => this.props.onMessageSent({ message });

  loadMore = () => {
    const { hasMore, isFetching } = this.props;

    if (!isFetching && hasMore) {
      this.throttledLoadMore();
    }
  };

  handleDeleteAll = async () => {
    const {
      messages, deleteDiscussion, discussionId, closeTab,
    } = this.props;

    // FIXME : only deletes fetched messages.
    deleteDiscussion({ discussionId, messages });
    closeTab();
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
      discussionId, messages, scrollToTarget, isFetching, location,
      hasMore, user, isUserFetching, discussion,
    } = this.props;
    const hash = location.hash ? location.hash.slice(1) : null;

    return (
      <section id={`discussion-${discussionId}`} className="s-discussion">
        <StickyNavBar className="s-discussion__action-bar" stickyClassName="s-discussion__action-bar--sticky">
          <header className="s-discussion__header">
            {discussion ? this.renderTags(discussion) : null}
            <div className="s-discussion__actions">
              <strong className="s-discussion__action-label">
                <Trans id="discussion.action.label">Whole discussion</Trans>
                :
              </strong>
              <Button className="m-message-list__action" icon="reply" onClick={this.handleMessageReply} responsive="icon-only">
                <Trans id="discussion.action.reply">Reply</Trans>
              </Button>
              {/*
                <Button
                  className="m-message-list__action"
                  icon="tags"
                  onClick={this.handleOpenTags}
                  responsive="icon-only"
                >
                  Tag
                </Button>
                <Button
                  className="m-message-list__action"
                  icon="trash"
                  onClick={this.handleDeleteAll}
                  responsive="icon-only"
                >
                  Delete
                </Button>
                */}
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
          scrollToTarget={scrollToTarget}
          user={user}
          isUserFetching={isUserFetching}
        />
        <div className={classnames('s-discussion__reply', { 's-discussion__reply--open': this.state.isDraftFocus })}>
          <ReplyForm
            scrollToMe={hash === 'reply' ? scrollToTarget : undefined}
            discussionId={discussionId}
            internalId={discussionId}
            onFocus={this.handleFocusDraft}
            onSent={this.handleMessageSent}
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
