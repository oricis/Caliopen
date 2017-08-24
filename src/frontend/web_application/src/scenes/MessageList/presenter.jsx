import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import MessageListBase from '../../components/MessageList';
import Button from '../../components/Button';
import ReplyForm from './components/DraftForm';

const LOAD_MORE_THROTTLE = 1000;

class MessageList extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    requestMessages: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    hasDraft: PropTypes.bool,
    didInvalidate: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    setMessageRead: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    replyToMessage: PropTypes.func.isRequired,
    copyMessageTo: PropTypes.func.isRequired,
    editMessageTags: PropTypes.func.isRequired,
    removeTab: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    currentTab: PropTypes.shape({}),
  };

  static defaultProps = {
    messages: [],
    discussion: {},
    currentTab: undefined,
    hasDraft: false,
  };

  componentDidMount() {
    const { discussionId } = this.props;
    this.props.requestMessages({ discussion_id: discussionId });

    this.throttledLoadMore = throttle(
      () => this.props.loadMore(),
      LOAD_MORE_THROTTLE,
      { trailing: false }
    );
  }

  componentWillReceiveProps(nextProps) {
    const { didInvalidate, isFetching, messages, hasDraft, currentTab } = nextProps;
    if (didInvalidate && !isFetching) {
      this.props.requestMessages({ discussion_id: nextProps.discussionId });
    }

    if (!didInvalidate && !isFetching && messages.length === 0 && !hasDraft) {
      this.props.removeTab(currentTab);
    }
  }

  handleSetMessageRead = ({ message }) => {
    this.props.setMessageRead({ message, isRead: true });
  };

  handleSetMessageUnread = ({ message }) => {
    this.props.setMessageRead({ message, isRead: false });
  };

  handleDeleteMessage = ({ message }) => {
    const { deleteMessage } = this.props;
    deleteMessage({ message });
  };

  handleDelete = () => {
    const { messages, deleteMessage } = this.props;
    Promise.all(messages.map(message => deleteMessage({ message })));
  };

  loadMore = () => {
    if (this.props.hasMore) {
      this.throttledLoadMore();
    }
  }

  renderLoadMore() {
    const { __, hasMore } = this.props;

    return hasMore && (
      <Button shape="hollow" onClick={this.loadMore}>{__('general.action.load_more')}</Button>
    );
  }

  render() {
    const {
      messages, discussionId, isFetching, replyToMessage, copyMessageTo, editMessageTags,
    } = this.props;

    return (
      <MessageListBase
        messages={messages}
        onMessageRead={this.handleSetMessageRead}
        onMessageUnread={this.handleSetMessageUnread}
        isFetching={isFetching}
        replyForm={<ReplyForm discussionId={discussionId} internalId={discussionId} />}
        onForward={() => {}}
        onDelete={this.handleDelete}
        onMessageDelete={this.handleDeleteMessage}
        loadMore={this.renderLoadMore()}
        onMessageReply={replyToMessage}
        onMessageCopyTo={copyMessageTo}
        onMessageEditTags={editMessageTags}
      />
    );
  }
}

export default MessageList;
