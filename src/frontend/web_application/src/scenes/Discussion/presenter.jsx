import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../components';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import MessageList from './components/MessageList';
import QuickReplyForm from './components/QuickReplyForm';

import './style.scss';

/**
 * Discussion Component.
 * Displays messages of a discussion and a reply form.
 *
 * @extends {Component}
 *
 * @prop {string} discussionId      - ID of discussion to display
 * @prop {function} scrollToTarget  - function provided by scrollManager
 * @prop {function} hash            - URL hash (fragment) provided by scrollManager
 */
class Discussion extends Component {
  static propTypes = {
    requestMessages: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    discussionId: PropTypes.string.isRequired,
    discussion: PropTypes.shape({}).isRequired,
    scrollToTarget: PropTypes.function,
    isFetching: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    hash: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    setMessageRead: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    draft: PropTypes.shape({}),
  };

  static defaultProps = {
    scrollToTarget: undefined,
    hash: undefined,
    messages: [],
    draft: {},
  };

  componentDidMount() {
    const { discussionId } = this.props;
    this.props.requestMessages({ discussion_id: discussionId });
  }

  handleDeleteMessage = ({ message }) => {
    this.props.deleteMessage({ message });
  }

  handleSetMessageRead = ({ message }) => {
    this.props.setMessageRead({ message, isRead: true });
  };

  render() {
    const {
      discussionId, messages, isFetching, hash, scrollToTarget,
      draft,
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
          isFetching={isFetching}
          hash={hash}
          onMessageRead={this.handleSetMessageRead}
          onMessageDelete={this.handleDeleteMessage}
          scrollTotarget={scrollToTarget}
        />
        <QuickReplyForm draft={draft} />
      </section>
    );
  }
}

export default Discussion;
