import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { clearDraft, syncDraft } from '../../store/modules/draft-message';
import { newDraft, saveDraft, sendDraft } from '../../modules/draftMessage';
import { uploadDraftAttachments, deleteDraftAttachment } from '../../modules/file';
import { withNotification } from '../../modules/userNotify';
import { withCloseTab, withCurrentTab } from '../../modules/tab';
import { updateTagCollection } from '../../modules/tags';
import { deleteMessage } from '../../modules/message';
import Presenter from './presenter';

const messageDraftSelector = state => state.draftMessage.draftsByInternalId;
const messageSelector = state => state.message.messagesById;
const internalIdSelector = (state, ownProps) => ownProps.match.params.internalId;
const draftSelector = createSelector(
  [messageDraftSelector, internalIdSelector],
  (draftsByInternalId, internalId) => draftsByInternalId[internalId],
);

const mapStateToProps = createSelector(
  [draftSelector, messageSelector, internalIdSelector],
  (draft, messagesById, internalId) => ({
    draft,
    message: draft && messagesById[draft.message_id],
    internalId,
  })
);

const onSaveDraft = ({ internalId, draft, message }) => dispatch =>
  dispatch(saveDraft({ internalId, draft, message }, { force: true }));

const onEditDraft = ({ draft, message, internalId }) => dispatch =>
  dispatch(saveDraft({ draft, message, internalId }, { withThrottle: true }));

const onUpdateEntityTags = (internalId, i18n, message, { type, entity, tags }) =>
  async (dispatch) => {
    const savedDraft = await dispatch(saveDraft({ internalId, draft: entity, message }, {
      withThrottle: false,
      force: true,
    }));
    const messageUpTodate = await dispatch(updateTagCollection(
      i18n,
      { type, entity: savedDraft, tags }
    ));

    return dispatch(syncDraft({ internalId, draft: messageUpTodate }));
  };

const onUploadAttachments = (internalId, i18n, message, { draft, attachments }) =>
  async (dispatch) => {
    try {
      const savedDraft = await dispatch(saveDraft({ internalId, draft, message }, {
        withThrottle: false,
        force: true,
      }));

      const messageUpTodate = await dispatch(uploadDraftAttachments({
        message: savedDraft, attachments,
      }));

      return dispatch(syncDraft({ internalId, draft: messageUpTodate }));
    } catch (err) {
      return Promise.reject(err);
    }
  };

const onDeleteAttachement = (internalId, i18n, message, { draft, attachment }) =>
  async (dispatch) => {
    try {
      const savedDraft = await dispatch(saveDraft({ internalId, draft, message }, {
        withThrottle: false,
        force: true,
      }));

      const messageUpTodate = await dispatch(deleteDraftAttachment({
        message: savedDraft, attachment,
      }));

      return dispatch(syncDraft({ internalId, draft: messageUpTodate }));
    } catch (err) {
      return Promise.reject(err);
    }
  };

const onSendDraft = ({ draft, message, internalId }) => async (dispatch) => {
  try {
    const messageUpToDate = await dispatch(saveDraft({ draft, message, internalId }, {
      withThrottle: false,
    }));
    await dispatch(sendDraft({ draft: messageUpToDate }));

    dispatch(clearDraft({ internalId }));

    return messageUpToDate;
  } catch (err) {
    return Promise.reject(err);
  }
};

const onDeleteMessage = ({ message, internalId }) => dispatch =>
  dispatch(deleteMessage({ message }))
    .then(() => dispatch(clearDraft({ internalId })));

const mapDispatchToProps = dispatch => bindActionCreators({
  requestDraft: newDraft,
  onEditDraft,
  onSaveDraft,
  onSendDraft,
  onDeleteMessage,
  onUpdateEntityTags,
  onUploadAttachments,
  onDeleteAttachement,
}, dispatch);

export default compose(
  withI18n(),
  withNotification(),
  withCurrentTab(),
  withCloseTab(),
  connect(mapStateToProps, mapDispatchToProps)
)(Presenter);
