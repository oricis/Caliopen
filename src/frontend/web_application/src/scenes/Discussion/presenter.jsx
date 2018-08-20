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
    hash: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
  };

  static defaultProps = {
    scrollToTarget: undefined,
    hash: undefined,
    messages: [],
  };

  componentDidMount() {
    const { discussionId } = this.props;
    this.props.requestMessages({ discussion_id: discussionId });
  }

  render() {
    const { discussionId, messages, scrollToTarget } = this.props;

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
        <MessageList className="m-message-list" messages={messages} discussionId={discussionId} scrollTotarget={scrollToTarget} />
        <QuickReplyForm />
      </section>
    );
  }
}

export default Discussion;
