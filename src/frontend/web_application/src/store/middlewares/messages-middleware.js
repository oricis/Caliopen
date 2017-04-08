import { CREATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_SUCCESS, invalidate } from '../modules/message';

export default store => next => (action) => {
  const result = next(action);

  if ([CREATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_SUCCESS].indexOf(action.type) !== -1) {
    store.dispatch(invalidate());
  }

  return result;
};
