import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../components';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import getClient from '../../services/api-client';
import Message from './components/Message';
import QuickReplyForm from './components/QuickReplyForm';
import ProtocolSwitch from './components/ProtocolSwitch';
import { calcPiValue } from '../../services/pi';

import './style.scss';

class Discussion extends Component {
  static propTypes = {
    discussionId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.client = getClient();
  }

  state = {};

  componentDidMount() {
    this.client.get(`/api/v2/messages?discussion_id=${this.props.discussionId}`)
      .then(response => this.setState({
        messages: response.data.messages.sort((a, b) =>
          new Date(a.date_sort) - new Date(b.date_sort)),
      }));
  }

  findMessageBefore(message) {
    const { messages } = this.state;
    const index = messages.indexOf(message) - 1;

    return messages[index];
  }

  render() {
    const { discussionId } = this.props;
    const messageList = [];

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
        {this.state.messages && this.state.messages.reduce((acc, message) => {
          if (message.type !== 'email' && messageList.length > 0
            && this.findMessageBefore(message).type !== message.type) {
            messageList.push(<ProtocolSwitch
              newProtocol={message.type}
              pi={calcPiValue(message)}
              date={message.date}
              key={`switch-${message.message_id}`}
            />);
          }
          messageList.push(<Message message={message} key={message.message_id} />);

          return messageList;
        }, messageList)}
        <QuickReplyForm />
      </section>
    );
  }
}

export default Discussion;
