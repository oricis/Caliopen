import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Redirect } from 'react-router-dom';
import { DraftMessage } from '../../modules/draftMessage';
import { withPush } from '../../modules/routing';
import { withCloseTab } from '../../modules/tab';
import DraftDiscussion from './components/DraftDiscussion';
import './style.scss';

@withPush()
@withCloseTab()
class NewDraft extends Component {
  static propTypes = {
    getMessage: PropTypes.func.isRequired,
    closeTab: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    messageId: PropTypes.string,
    message: PropTypes.shape({}),
  };

  static defaultProps = {
    messageId: undefined,
    message: undefined,
  };

  componentDidMount() {
    const { messageId } = this.props;

    if (messageId) {
      this.initMessage();
    }
  }

  initMessage = async () => {
    const { messageId, getMessage } = this.props;
    const message = await getMessage({ messageId });

    if (message && (message.parent_id || !message.is_draft)) {
      this.redirectDiscussion();
    }
  }

  handleSent = () => {
    this.redirectDiscussion();
  }

  redirectDiscussion = () => {
    const { push, closeTab, message } = this.props;

    if (!message || !message.discussion_id) {
      throw new Error(`Unable to redirect. No discussions for message "${message && message.message_id}"`);
    }
    closeTab();

    return push(`/discussions/${message.discussion_id}#${message.message_id}`);
  }

  render() {
    const { messageId, closeTab, message } = this.props;

    if (!messageId) {
      return <Redirect to={`/messages/${uuidv4()}`} />;
    }

    return (
      <div className="s-new-draft">
        <DraftMessage
          className="s-new-draft__form"
          key={messageId}
          internalId={messageId}
          messageId={messageId}
          message={message}
          hasDiscussion={false}
          onDeleteMessageSuccessfull={closeTab}
          onSent={this.handleSent}
        />
        <DraftDiscussion
          className="s-new-draft__discussion"
          // used in withDraftMessage
          messageId={messageId}
        />
      </div>
    );
  }
}

export default NewDraft;
