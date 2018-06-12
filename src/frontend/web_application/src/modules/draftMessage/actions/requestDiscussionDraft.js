import { v4 as uuidv4 } from 'uuid';
import { draftSelector } from '../selectors/draft';
import { syncDraft } from '../../../store/modules/draft-message';
import { newDraft } from './newDraft';
import { getDraft, getLastMessage } from '../../message';

export const requestDiscussionDraft = ({ internalId = uuidv4(), discussionId }) =>
  async (dispatch, getState) => {
    let draft = draftSelector(getState(), { internalId });

    if (draft) {
      return draft;
    }

    draft = await dispatch(getDraft({ discussionId }));

    if (draft) {
      dispatch(syncDraft({ internalId: discussionId, draft }));

      return draft;
    }

    draft = {};

    const messageInReply = await dispatch(getLastMessage({ discussionId })) || {};

    draft = {
      discussion_id: discussionId,
      subject: messageInReply.subject || '',
      parent_id: messageInReply.message_id || '',
    };

    draft = dispatch(newDraft({ internalId, draft }));

    return draft;
  };
