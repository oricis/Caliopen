import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { editDraft, requestDraft, saveDraft, sendDraft } from '../../../../store/modules/draft-message';
import Presenter from './presenter';

const messageDraftSelector = state => state.draftMessage.draftsByDiscussionId;
const discussionIdSelector = (state, ownProps) => ownProps.discussionId;
const messageSelector = state => state.message.messagesById;

const mapStateToProps = createSelector(
  [messageDraftSelector, discussionIdSelector, messageSelector],
  (drafts, discussionId, messages) => {
    const draft = drafts[discussionId];
    const message = Object.keys(messages)
      .map(messageId => messages[messageId])
      .find(item => (item.discussion_id === discussionId && item.is_draft === true));

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
  saveDraft,
  sendDraft,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
