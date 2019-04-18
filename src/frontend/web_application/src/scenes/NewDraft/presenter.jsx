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
    const { messageId, getMessage } = this.props;

    if (messageId) {
      getMessage({ messageId });
    }
  }

  handleSent = ({ message }) => {
    const { push } = this.props;

    // closeTab();

    return push(`/discussions/${message.discussion_id}`);
  }

  render() {
    const { messageId, closeTab, message } = this.props;

    if (!messageId) {
      return <Redirect to={`/messages/${uuidv4()}`} />;
    }

    if (message && !message.is_draft) {
      return <Redirect to={`/discussions/${message.discussion_id}`} />;
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
