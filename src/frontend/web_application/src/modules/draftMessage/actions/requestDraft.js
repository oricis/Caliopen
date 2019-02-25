import { requestDraft as requestDraftBase, requestDraftSuccess } from '../../../store/modules/draft-message';
import { newDraft } from './newDraft';
import { getDraft, getMessage, getLastMessage, Message } from '../../message';
import { draftSelector } from '../../draftMessage';

export const requestDraft = ({ internalId, hasDiscussion }) =>
  async (dispatch, getState) => {
    let draft = draftSelector(getState(), { internalId });

    if (draft) {
      return draft;
    }

    dispatch(requestDraftBase({ internalId }));

    if (!hasDiscussion) {
      try {
        const message = await dispatch(getMessage({ messageId: internalId }));
        dispatch(requestDraftSuccess({ internalId, draft: message }));

        return message;
      } catch (err) {
        const nextDraft = await dispatch(newDraft({
          internalId,
          // XXX: refactor - this forces the message_id when draft not associated to a discussion
          //    in case of a discussion, the internalId is the discussion_id
          draft: new Message({ message_id: internalId }),
        }));
        dispatch(requestDraftSuccess({ internalId, draft: nextDraft }));

        return nextDraft;
      }
    }

    draft = await dispatch(getDraft({ discussionId: internalId }));

    if (draft) {
      dispatch(requestDraftSuccess({ internalId, draft }));

      return draft;
    }

    const messageInReply = await dispatch(getLastMessage({ discussionId: internalId })) || {};
    draft = new Message({
      discussion_id: internalId,
      subject: messageInReply.subject || '',
      parent_id: messageInReply.message_id,
    });

    const nextDraft = await dispatch(newDraft({ internalId, draft }));
    dispatch(requestDraftSuccess({ internalId, draft: nextDraft }));

    return nextDraft;
  };
