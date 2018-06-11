import { v4 as uuidv4 } from 'uuid';
import { tryCatchAxiosAction } from '../../../services/api-client';
import { draftSelector } from '../selectors/draft';
import { requestDraft } from '../../../store/modules/message';
import { syncDraft } from '../../../store/modules/draft-message';
import { newDraft } from './newDraft';

export const requestDiscussionDraft = ({ internalId = uuidv4(), discussionId }) =>
  async (dispatch, getState) => {
    let draft = draftSelector(getState(), { internalId });

    if (draft) {
      return draft;
    }

    const response = await tryCatchAxiosAction(() =>
      dispatch(requestDraft({ discussionId })));
    [draft] = response.messages;

    if (draft) {
      dispatch(syncDraft({ internalId: discussionId, draft }));

      return draft;
    }

    draft = {};

    // FIXME: this can be done in the component
    // first is the last received message
    // const messageInReply = messages[0] || {};

    draft = {
      discussion_id: discussionId,
      // subject: messageInReply.subject || '',
      // parent_id: messageInReply.message_id || '',
    };

    draft = dispatch(newDraft({ internalId, draft }));

    return draft;
  };
