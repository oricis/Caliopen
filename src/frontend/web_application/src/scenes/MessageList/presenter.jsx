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
    invalidate: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    didInvalidate: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    setMessageRead: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    removeTab: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    currentTab: PropTypes.shape({}),
  };

  static defaultProps = {
    messages: [],
    discussion: {},
    currentTab: undefined,
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
    if (nextProps.didInvalidate && !nextProps.isFetching) {
      this.props.requestMessages({ discussion_id: nextProps.discussionId });
    }

    if (!nextProps.didInvalidate && !nextProps.isFetching && nextProps.messages.length === 0) {
      const { currentTab, removeTab } = nextProps;
      removeTab(currentTab);
    }
  }

  handleViewMessage = ({ message }) => {
    this.props.setMessageRead({ message, isRead: true });
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
    const { messages, discussionId, isFetching } = this.props;

    return (
      <MessageListBase
        messages={messages}
        isFetching={isFetching}
        onMessageView={this.handleViewMessage}
        replyForm={<ReplyForm discussionId={discussionId} internalId={discussionId} />}
        onReply={() => {}}
        onForward={() => {}}
        onDelete={this.handleDelete}
        onMessageDelete={this.handleDeleteMessage}
        loadMore={this.renderLoadMore()}
      />
    );
  }
}

export default MessageList;
