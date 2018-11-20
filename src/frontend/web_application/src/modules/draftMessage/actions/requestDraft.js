import { draftSelector } from '../selectors/draft';
import { requestDraft as requestDraftBase, requestDraftSuccess } from '../../../store/modules/draft-message';
import { newDraft } from './newDraft';
import { getDraft, getLastMessage, Message } from '../../message';

export const requestDraft = ({ internalId, hasDiscussion }) =>
  async (dispatch, getState) => {
    let draft = draftSelector(getState(), { internalId });

    if (draft) {
      return draft;
    }

    dispatch(requestDraftBase({ internalId }));

    if (!hasDiscussion) {
      const nextDraft = await dispatch(newDraft({ internalId, draft: new Message() }));
      dispatch(requestDraftSuccess({ internalId, draft: nextDraft }));

      return nextDraft;
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
