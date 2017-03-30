import React, { Component, PropTypes } from 'react';
import MessageListBase from '../../components/MessageList';

class MessageList extends Component {
  static propTypes = {
    requestMessages: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    updateMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    messages: [],
  };

  constructor(props) {
    super(props);
    this.handleMessageViewed = this.handleMessageViewed.bind(this);
  }

  componentDidMount() {
    const { discussionId } = this.props;
    this.props.requestMessages({ discussionId });
  }

  handleMessageViewed({ message }) {
    this.props.updateMessage({ message: { ...message, is_unread: false }, original: message });
  }

  render() {
    const { messages } = this.props;

    return <MessageListBase messages={messages} onMessageView={this.handleMessageViewed} />;
  }
}

export default MessageList;
