import { postActions, requestMessage } from '../../../store/modules/message';
import { messagesByIdSelector } from '../../../store/selectors/message';

export const sendDraft = ({ draft: message }) => async (dispatch, getState) => {
  await dispatch(postActions({ message, actions: ['send'] }));
  await dispatch(requestMessage(message.message_id));

  return messagesByIdSelector(getState())[message.message_id];
};
