import { tryCatchAxiosAction } from '../../../services/api-client';
import { requestDraft } from '../../../store/modules/message';
import { discussionDraftSelector } from '../../discussion';

export const getDraft = ({ discussionId }) => async (dispatch, getState) => {
  let draft = discussionDraftSelector(getState(), { discussionId });

  if (draft) {
    return draft;
  }

  const response = await tryCatchAxiosAction(() => dispatch(requestDraft({ discussionId })));
  [draft] = response.messages;

  return draft;
};
