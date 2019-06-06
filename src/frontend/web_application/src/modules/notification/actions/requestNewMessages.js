import { getMessages } from '../../../modules/message';
import { addToCollection } from '../../../store/modules/message';

export const requestNewMessages = messageIds => async (dispatch) => {
  const messages = await dispatch(getMessages(messageIds));
  await Promise.all(messages.map(message => dispatch(addToCollection({ message }))));

  return messages;
};
