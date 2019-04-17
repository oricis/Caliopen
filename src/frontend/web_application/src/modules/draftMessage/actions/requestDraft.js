import {
  requestDraft as requestDraftBase, requestDraftSuccess, createDraft,
} from '../../../store/modules/draft-message';
import {
  getDraft, getMessage, getLastMessage, Message,
} from '../../../modules/message';
import { getUser } from '../../../modules/user';
import { draftSelector } from '../selectors/draft';
import { getDefaultIdentity } from './getDefaultIdentity';
import { changeAuthorInParticipants } from '../services/changeAuthorInParticipants';

const requestDiscussionDraft = ({ internalId }) => async (dispatch) => {
  dispatch(requestDraftBase({ internalId }));
  const draft = await dispatch(getDraft({ discussionId: internalId }));

  if (draft) {
    dispatch(requestDraftSuccess({ internalId, draft }));

    return draft;
  }

  const [parentMessage, user] = await Promise.all([
    dispatch(getLastMessage({ discussionId: internalId })),
    dispatch(getUser()),
  ]);
  const { participants, type: protocol } = parentMessage;
  const identity = await dispatch(getDefaultIdentity({ participants, protocol }));
  const newDraft = new Message({
    // discussion_id is never saved for a draft, it set by the backend when the message is sent
    // rollback 5fb2eb667210cfe8336b03d48efb5a350ccf32cd and await for new discussion algo (still
    // not working with current API)
    // XXX: the next API will give the discussionId according to participants
    // may be better to give the participants and the default identity according to the
    // discussionId?
    // how to deal w/ no network capability?
    discussion_id: internalId,
    subject: parentMessage.subject || '',
    parent_id: parentMessage.message_id,
    user_identities: identity ? [identity.identity_id] : [],
    participants: changeAuthorInParticipants({
      participants: parentMessage.participants, user, identity,
    }),
  });

  await dispatch(createDraft({ internalId, draft: newDraft }));
  dispatch(requestDraftSuccess({ internalId, draft: newDraft }));

  return newDraft;
};

export const requestDraft = ({ internalId, hasDiscussion, messageId }) => (
  async (dispatch, getState) => {
    const draft = draftSelector(getState(), { internalId });

    if (draft) {
      return draft;
    }

    if (hasDiscussion) {
      return dispatch(requestDiscussionDraft({ internalId }));
    }

    if (!messageId) {
      throw new Error('a messageId must be defined when not in a discussion');
    }

    dispatch(requestDraftBase({ internalId }));

    try {
      const message = await dispatch(getMessage({ messageId }));
      dispatch(requestDraftSuccess({ internalId, draft: message }));

      return message;
    } catch (err) {
      const identity = await dispatch(getDefaultIdentity());
      const newDraft = new Message({
        message_id: messageId,
        user_identities: identity ? [identity.identity_id] : [],
      });
      await dispatch(createDraft({ internalId, draft: newDraft }));
      dispatch(requestDraftSuccess({ internalId, draft: newDraft }));

      return newDraft;
    }
  }
);
