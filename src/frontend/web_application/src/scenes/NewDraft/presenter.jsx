import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Redirect } from 'react-router-dom';
import { DraftMessage } from '../../modules/draftMessage';
import { withPush, withRouteParams } from '../../modules/routing';
import { withCloseTab } from '../../modules/tab';
import DraftDiscussion from './components/DraftDiscussion';
import './style.scss';

@withPush()
@withRouteParams()
@withCloseTab()
class NewDraft extends Component {
  static propTypes = {
    closeTab: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    routeParams: PropTypes.shape({}).isRequired,
  };

  handleSent = ({ message }) => {
    const { push } = this.props;

    return push(`/discussions/${message.discussion_id}`);
  }

  render() {
    const { routeParams, closeTab } = this.props;

    if (!routeParams.messageId) {
      return <Redirect to={`/messages/${uuidv4()}`} />;
    }

    return (
      <div className="s-new-draft">
        <DraftMessage
          className="s-new-draft__form"
          key={routeParams.messageId}
          internalId={routeParams.messageId}
          hasDiscussion={false}
          onDeleteMessageSuccessfull={closeTab}
          onSent={this.handleSent}
        />
        <DraftDiscussion
          className="s-new-draft__discussion"
          // used in withDraftMessage
          messageId={routeParams.messageId}
        />
      </div>
    );
  }
}

export default NewDraft;
