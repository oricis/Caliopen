import { saveDraft } from './saveDraft';
import { requestDraft } from './requestDraft';

export const reply = ({ internalId, message: messageInReply }) => async (
  dispatch
) => {
  const message = await dispatch(
    requestDraft({
      internalId,
      discussionId: messageInReply.discussion_id,
    })
  );

  const draft = {
    ...message,
    parent_id: messageInReply.message_id,
  };

  return dispatch(saveDraft({ internalId, draft, message }));
};
