import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createMessageCollectionStateSelector } from '../../../../store/selectors/message';
import {
  deleteDraft, deleteDraftSuccess, clearDraft, syncDraft,
} from '../../../../store/modules/draft-message';
import { deleteMessage, getLastMessageFromArray } from '../../../message';
import { withContacts } from '../../../contact';
import { updateTagCollection } from '../../../tags';
import { saveDraft } from '../../actions/saveDraft';
import { sendDraft } from '../../actions/sendDraft';
import { calcSyncDraft } from '../../services/calcSyncDraft';
import { uploadDraftAttachments, deleteDraftAttachment } from '../../../file';
import { withIdentities } from '../../../identity';
import { userSelector } from '../../../user';
import { withDraftMessage } from './withDraftMessage';
import { filterIdentities } from '../../services/filterIdentities';
import { isMessageEncrypted } from '../../../../services/encryption';
import { messageEncryptionStatusSelector } from '../../../encryption/selectors/message';
import Presenter from './presenter';

const internalIdSelector = (state, ownProps) => ownProps.internalId;
const identityStateSelector = (state, { identHoc: { identities, isFetching } }) => ({
  identities, isFetching,
});
const contactsSelector = (state, ownProps) => ownProps.contacts;
const draftSelector = (state, {
  draftMessage, isRequestingDraft, isDeletingDraft, original,
}) => ({
  draftMessage, isRequestingDraft, isDeletingDraft, original,
});

const discussionIdSelector = (state, ownProps) => {
  const { internalId, hasDiscussion } = ownProps;

  return hasDiscussion ? internalId : undefined;
};

const messageCollectionStateSelector = createMessageCollectionStateSelector(() => 'discussion', discussionIdSelector);
const sentMessagesSelector = createSelector(
  [messageCollectionStateSelector],
  ({ messages }) => messages.filter(item => item.is_draft !== true)
);
const parentMessageSelector = createSelector([
  draftSelector, sentMessagesSelector,
], ({ draftMessage }, sentMessages) => draftMessage && sentMessages
  .find(item => item.message_id === draftMessage.parent_id));

const availableIdentitiesSelector = createSelector([
  identityStateSelector, userSelector, contactsSelector, parentMessageSelector,
], ({ identities }, user, contacts, parentMessage) => filterIdentities({
  identities, user, contacts, parentMessage,
}));

const mapStateToProps = createSelector([
  draftSelector, messageCollectionStateSelector, internalIdSelector, availableIdentitiesSelector,
  parentMessageSelector, sentMessagesSelector, identityStateSelector,
  messageEncryptionStatusSelector,
], (
  {
    draftMessage, isRequestingDraft, isDeletingDraft, original,
  }, { messages }, internalId, availableIdentities, parentMessage, sentMessages,
  { isFetching: isIdentitiesFetching }, messageEncryptionStatus,
) => {
  const lastMessage = getLastMessageFromArray(sentMessages);
  const canEditRecipients = messages.some(message => !message.is_draft) === false;

  return {
    key: draftMessage && draftMessage.message_id,
    draftMessage,
    isEncrypted: original && isMessageEncrypted(original),
    isFetching: isRequestingDraft || isIdentitiesFetching,
    isDeletingDraft,
    canEditRecipients,
    original,
    parentMessage: parentMessage !== lastMessage ? parentMessage : undefined,
    internalId,
    availableIdentities,
    isReply: parentMessage && true,
    draftEncryption: draftMessage && messageEncryptionStatus[draftMessage.message_id],
    encryptionStatus: original && messageEncryptionStatus[original.message_id]
      && messageEncryptionStatus[original.message_id].status,
  };
});

const onEditDraft = ({ internalId, draft, message }) => (
  dispatch => dispatch(saveDraft({ internalId, draft, message }, { withThrottle: true }))
);

const onSaveDraft = ({ internalId, draft, message }) => (
  dispatch => dispatch(saveDraft({ internalId, draft, message }, { force: true }))
);

const onDeleteMessage = ({ message, internalId }) => async (dispatch) => {
  dispatch(deleteDraft({ internalId }));
  const result = await dispatch(deleteMessage({ message }));

  await dispatch(clearDraft({ internalId }));
  dispatch(deleteDraftSuccess({ internalId }));

  return result;
};

const onUpdateEntityTags = (internalId, i18n, message, { type, entity, tags }) => (
  async (dispatch) => {
    const savedDraft = await dispatch(saveDraft({ internalId, draft: entity, message }, {
      withThrottle: false,
      force: true,
    }));
    const messageUpTodate = await dispatch(updateTagCollection(
      i18n,
      { type, entity: savedDraft, tags }
    ));
    const nextDraft = calcSyncDraft({ message: messageUpTodate, draft: entity });

    return dispatch(syncDraft({ internalId, draft: nextDraft }));
  }
);

const onUploadAttachments = (internalId, i18n, message, { draft, attachments }) => (
  async (dispatch) => {
    try {
      const savedDraft = await dispatch(saveDraft({ internalId, draft, message }, {
        withThrottle: false,
        force: true,
      }));

      const messageUpTodate = await dispatch(uploadDraftAttachments({
        message: savedDraft, attachments,
      }));
      const nextDraft = calcSyncDraft({ message: messageUpTodate, draft });

      return dispatch(syncDraft({ internalId, draft: nextDraft }));
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

const onDeleteAttachement = (internalId, i18n, message, { draft, attachment }) => (
  async (dispatch) => {
    try {
      const savedDraft = await dispatch(saveDraft({ internalId, draft, message }, {
        withThrottle: false,
        force: true,
      }));

      const messageUpTodate = await dispatch(deleteDraftAttachment({
        message: savedDraft, attachment,
      }));

      const nextDraft = calcSyncDraft({ message: messageUpTodate, draft });

      return dispatch(syncDraft({ internalId, draft: nextDraft }));
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

const onSendDraft = ({ draft, message, internalId }) => async (dispatch) => {
  try {
    const savedMessage = await dispatch(saveDraft({ draft, message, internalId }, {
      withThrottle: false,
    }));
    // discussion_id is set after the message has been sent for new drafts
    const messageUpToDate = await dispatch(sendDraft({ draft: savedMessage }));

    dispatch(clearDraft({ internalId }));

    return messageUpToDate;
  } catch (err) {
    return Promise.reject(err);
  }
};

const mapDispatchToProps = dispatch => bindActionCreators({
  onEditDraft,
  onSaveDraft,
  onSendDraft,
  onDeleteMessage,
  onUpdateEntityTags,
  onUploadAttachments,
  onDeleteAttachement,
}, dispatch);

export default compose(...[
  withDraftMessage(),
  withIdentities({ namespace: 'identHoc' }),
  withContacts(),
  connect(mapStateToProps, mapDispatchToProps),
])(Presenter);
