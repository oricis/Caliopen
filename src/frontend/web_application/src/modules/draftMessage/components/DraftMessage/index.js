import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createMessageCollectionStateSelector } from '../../../../store/selectors/message';
import { deleteDraft, deleteDraftSuccess, clearDraft, syncDraft } from '../../../../store/modules/draft-message';
import { withContacts } from '../../../../modules/contact';
import { updateTagCollection } from '../../../../modules/tags';
import { saveDraft, sendDraft } from '../../../../modules/draftMessage';
import { uploadDraftAttachments, deleteDraftAttachment } from '../../../../modules/file';
import { deleteMessage } from '../../../../modules/message';
import { withIdentities } from '../../../../modules/identity';
import { userSelector } from '../../../../modules/user';
import { getLastMessage } from '../../../../services/message';
import { withDraftMessage } from './withDraftMessage';
import { withCurrentInternalId } from '../../hoc/withCurrentInternalId';
import { filterIdentities } from '../../services/filterIdentities';

import Presenter from './presenter';

const internalIdSelector = (state, ownProps) => ownProps.internalId;
const identitiesSelector = (state, ownProps) => ownProps.identities;
const contactsSelector = (state, ownProps) => ownProps.contacts;
const draftSelector = (state, {
  draftMessage, isRequestingDraft, isDeletingDraft, original,
}) =>
  ({
    draftMessage, isRequestingDraft, isDeletingDraft, original,
  });

const messageCollectionStateSelector = createMessageCollectionStateSelector(() => 'discussion', internalIdSelector);
const sentMessagesSelector = createSelector(
  [messageCollectionStateSelector],
  ({ messages }) => messages.filter(item => item.is_draft !== true)
);
const parentMessageSelector = createSelector([
  draftSelector, sentMessagesSelector,
], ({ draftMessage }, sentMessages) => draftMessage && sentMessages
  .find(item => item.message_id === draftMessage.parent_id));

const availableIdentitiesSelector = createSelector([
  identitiesSelector, userSelector, contactsSelector, parentMessageSelector,
], (identities, user, contacts, parentMessage) => filterIdentities({
  identities, user, contacts, parentMessage,
}));

const mapStateToProps = createSelector(
  [
    draftSelector, messageCollectionStateSelector, internalIdSelector, availableIdentitiesSelector,
    parentMessageSelector, sentMessagesSelector,
  ],
  ({
    draftMessage, isRequestingDraft, isDeletingDraft, original,
  }, { messages }, internalId, availableIdentities, parentMessage, sentMessages) => {
    const lastMessage = getLastMessage(sentMessages);

    return {
      draftMessage,
      isRequestingDraft,
      isDeletingDraft,
      canEditRecipients: messages.length === 0 || (messages.length === 1 && original && true),
      original,
      parentMessage: parentMessage !== lastMessage ? parentMessage : undefined,
      internalId,
      availableIdentities,
    };
  }
);

const onEditDraft = ({ internalId, draft, message }) => dispatch =>
  dispatch(saveDraft({ internalId, draft, message }, { withThrottle: true }));

const onSaveDraft = ({ internalId, draft, message }) => dispatch =>
  dispatch(saveDraft({ internalId, draft, message }, { force: true }));

const onDeleteMessage = ({ message, internalId }) => async (dispatch) => {
  dispatch(deleteDraft({ internalId }));
  const result = await dispatch(deleteMessage({ message }));

  await dispatch(clearDraft({ internalId }));
  dispatch(deleteDraftSuccess({ internalId }));

  return result;
};

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

    return dispatch(clearDraft({ internalId }));
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
  withCurrentInternalId(),
  withIdentities(),
  withContacts(),
  connect(mapStateToProps, mapDispatchToProps),
])(Presenter);
