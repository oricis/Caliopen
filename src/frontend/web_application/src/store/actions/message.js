import { requestMessages as requestMessagesBase, createMessage as createMessageBase, requestMessage, updateMessage as updateMessageBase } from '../modules/message';
import { tryCatchAxiosAction } from '../../services/api-client';

export const requestMessages = params => dispatch =>
  tryCatchAxiosAction(() => dispatch(requestMessagesBase(params)));

export const createMessage = ({ message }) => dispatch => tryCatchAxiosAction(async () => {
  await dispatch(createMessageBase({ message }));

  return dispatch(requestMessage(message.message_id));
});

export const updateMessage = ({ message, original }) => dispatch =>
  tryCatchAxiosAction(async () => {
    await dispatch(updateMessageBase({ message, original }));

    return dispatch(requestMessage(message.message_id));
  });
