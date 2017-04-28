import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MessageListBase from '../../components/MessageList';
import ReplyForm from './components/ReplyForm';

class MessageList extends Component {
  static propTypes = {
    requestMessages: PropTypes.func.isRequired,
    requestDiscussion: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    setMessageRead: PropTypes.func.isRequired,
  };

  static defaultProps = {
    messages: [],
    discussion: {},
  };

  constructor(props) {
    super(props);
    this.handleMessageViewed = this.handleMessageViewed.bind(this);
  }

  componentDidMount() {
    const { discussionId } = this.props;
    this.props.requestMessages({ discussionId });
    this.props.requestDiscussion({ discussionId });
  }

  handleMessageViewed({ message }) {
    this.props.setMessageRead({ message, isRead: true });
  }

  render() {
    const { messages, discussionId } = this.props;

    return (
      <MessageListBase
        messages={messages}
        onMessageView={this.handleMessageViewed}
        replyForm={<ReplyForm discussionId={discussionId} />}
        onReply={() => {}}
        onForward={() => {}}
        onDelete={() => {}}
      />
    );
  }
}

export default MessageList;
