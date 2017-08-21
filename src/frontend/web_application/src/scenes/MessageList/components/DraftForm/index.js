import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { editDraft, requestDraft, saveDraft, sendDraft } from '../../../../store/modules/draft-message';
import Presenter from './presenter';

const messageDraftSelector = state => state.draftMessage.draftsByDiscussionId;
const discussionIdSelector = (state, ownProps) => ownProps.discussionId;
const messageSelector = state => state.message.messagesById;
const userSelector = state => state.user.user;

const mapStateToProps = createSelector(
  [messageDraftSelector, discussionIdSelector, messageSelector, userSelector],
  (drafts, discussionId, messages, user) => {
    const draft = drafts[discussionId];
    const discussionMessages = Object.keys(messages)
      .map(messageId => messages[messageId])
      .filter(item => item.discussion_id === discussionId);
    const message = discussionMessages.find(item => item.is_draft === true);

    return {
      allowEditRecipients: discussionMessages.length === 1 && message && true,
      message,
      draft,
      discussionId,
      user,
    };
  }
);

const mapDispatchToProps = dispatch => bindActionCreators({
  editDraft,
  requestDraft,
  saveDraft,
  sendDraft,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
