import { fetchMessages } from './fetchMessages';
import { discussionSelector } from '../selectors/discussionSelector';

export const getLastMessage = ({ discussionId }) => async (dispatch, getState) => {
  const messages = discussionSelector(getState(), { discussionId });
  messages.sort((a, b) => ((new Date(a.date_sort)) - (new Date(b.date_sort))) * -1);
  let [lastMessage] = messages;

  if (lastMessage) {
    return lastMessage;
  }

  [lastMessage] = await dispatch(fetchMessages({
    discussion_id: discussionId,
    is_draft: false,
    limit: 1,
  }));

  return lastMessage;
};
