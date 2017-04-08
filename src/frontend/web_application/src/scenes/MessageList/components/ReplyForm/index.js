import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { editDraft, requestDraft } from '../../../../store/modules/draft-message';
import { createMessage, updateMessage, sendMessage } from '../../../../store/modules/message';
import Presenter from './presenter';

const messageDraftSelector = state => state.draftMessage.draftsByDiscussionId;
const discussionIdSelector = (state, ownProps) => ownProps.discussionId;
const messageSelector = state => state.message.messagesById;

const mapStateToProps = createSelector(
  [messageDraftSelector, discussionIdSelector, messageSelector],
  (drafts, discussionId, messages) => {
    const message = Object.keys(messages)
      .map(messageId => messages[messageId])
      .find(item => (item.discussion_id === discussionId && item.is_draft === true));
    const draft = (message) ? drafts[message.discussion_id] : undefined;

    return {
      message,
      draft,
      discussionId,
    };
  }
);

const mapDispatchToProps = dispatch => bindActionCreators({
  editDraft,
  requestDraft,
  createMessage,
  updateMessage,
  sendMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
