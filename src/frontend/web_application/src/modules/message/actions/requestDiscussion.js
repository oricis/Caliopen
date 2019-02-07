import { tryCatchAxiosAction } from '../../../services/api-client';
import { requestDiscussion as requestDiscussionBase } from '../../../store/modules/discussion';
import { requestMessages as requestMessagesBase } from '../../../store/modules/message';
import { createMessageCollectionStateSelector } from '../../../store/selectors/message';
import { discussionSelector, discussionIdSelector } from '../../discussion';

const messageCollectionSelector = createMessageCollectionStateSelector(() => 'discussion', discussionIdSelector);

export const requestDiscussion = ({ discussionId }) => async (dispatch, getState) => {
  const discussion = discussionSelector(getState(), { discussionId });

  const coll = messageCollectionSelector(getState(), { discussionId });
  const results = await Promise.all([
    discussion ?
      { discussion } :
      tryCatchAxiosAction(() => dispatch(requestDiscussionBase({ discussionId }))),
    coll && coll.messageIds && coll.messageIds.length > 0 ?
      undefined :
      dispatch(requestMessagesBase('discussion', discussionId, { discussion_id: discussionId })),
  ]);

  return results[0];
};
