import { deleteMessage as deleteMessageBase, removeFromCollection, invalidateAll } from '../../../store/modules/message';
import { requestDiscussion, removeDiscussionFromCollection, invalidate } from '../../../store/modules/discussion';
import { tryCatchAxiosAction } from '../../../services/api-client';

export const deleteMessage = ({ message }) => async (dispatch) => {
  try {
    const result = await dispatch(deleteMessageBase({ message }));
    // this must be placed after the real deletion in order to prevent re-render of connected
    // components and children
    dispatch(removeFromCollection({ message }));

    // XXX: when discussion no more available, the api redirect to an other location which fails
    // (due to the OPTION method ?)
    const discussion = await tryCatchAxiosAction(() =>
      dispatch(requestDiscussion({ discussionId: message.discussion_id })));
    if (!discussion) {
      dispatch(removeDiscussionFromCollection({ discussionId: message.discussion_id }));
    }

    return result;
  } catch (err) {
    await dispatch(invalidateAll());
    // XXX: force invalidate discussions but it should not be necessary
    dispatch(invalidate());

    return Promise.reject(err);
  }
};
