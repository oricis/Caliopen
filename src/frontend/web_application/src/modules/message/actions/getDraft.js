import { tryCatchAxiosAction } from '../../../services/api-client';
import { requestDraft } from '../../../store/modules/message';
// prevent circular reference to something in unit tests
import { discussionDraftSelector } from '../../discussion/selectors/discussionDraftSelector';

export const getDraft = ({ discussionId }) => async (dispatch, getState) => {
  let draft = discussionDraftSelector(getState(), { discussionId });

  if (draft) {
    return draft;
  }

  const response = await tryCatchAxiosAction(() =>
    dispatch(requestDraft({ discussionId }))
  );
  [draft] = response.messages;

  return draft;
};
