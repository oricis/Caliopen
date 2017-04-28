import { CREATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_SUCCESS, POST_ACTIONS_SUCCESS, invalidate, syncMessage } from '../modules/message';

export default store => next => (action) => {
  const result = next(action);

  if ([CREATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_SUCCESS].indexOf(action.type) !== -1) {
    store.dispatch(invalidate());
  }

  if (action.type === POST_ACTIONS_SUCCESS) {
    const { meta: { previousAction: { payload: message } } } = action;
    store.dispatch(syncMessage({ message }));
  }

  return result;
};
