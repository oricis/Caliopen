import { deleteMessage as deleteMessageBase, removeFromCollection, invalidateAll } from '../../../store/modules/message';
import { requestDiscussion, removeDiscussionFromCollection, invalidate } from '../../../store/modules/discussion';
import { tryCatchAxiosAction } from '../../../services/api-client';

export const deleteMessage = ({ message }) => async (dispatch) => {
  try {
    const result = await dispatch(deleteMessageBase({ message }));
    // this must be placed after the real deletion in order to prevent re-render of connected
    // components and children
    dispatch(removeFromCollection({ message }));

    if (message.discussion_id) {
      try {
        const discussion = await tryCatchAxiosAction(() => (
          dispatch(requestDiscussion({ discussionId: message.discussion_id }))
        ));
        dispatch(removeDiscussionFromCollection({ discussionId: discussion.discussion_id }));
      } catch (apiErrors) {
        if (!Array.isArray(apiErrors) || apiErrors[0].code !== 404) {
          throw apiErrors;
        }
      }
    }

    return result;
  } catch (err) {
    await dispatch(invalidateAll());
    // XXX: force invalidate discussions but it should not be necessary
    dispatch(invalidate());

    return Promise.reject(err);
  }
};
