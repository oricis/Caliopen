import { encryptMessage } from '../../modules/encryption';
import {
  CREATE_MESSAGE, UPDATE_MESSAGE, createMessage, updateMessage,
} from '../modules/message';

const modifyActionWithEncryptedMessage = ({ action, encryptedMessage }) => {
  switch (action.type) {
    case CREATE_MESSAGE:
      return createMessage({ message: encryptedMessage });
    case UPDATE_MESSAGE:
      return updateMessage({ message: encryptedMessage, original: action.payload.original });
    default:
      throw new Error(`action type "${action.type}" is not supported`);
  }
};

export default store => next => async (action) => {
  if (![CREATE_MESSAGE, UPDATE_MESSAGE].includes(action.type)) {
    return next(action);
  }

  const { message } = action.payload;
  const encryptedMessage = await store.dispatch(encryptMessage({ message }));

  if (encryptedMessage) {
    return next(modifyActionWithEncryptedMessage({ action, encryptedMessage }));
  }

  return next(action);
};
