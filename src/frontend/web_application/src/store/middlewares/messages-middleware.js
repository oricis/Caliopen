import { POST_ACTIONS_SUCCESS, DELETE_MESSAGE_SUCCESS, requestMessage, invalidate } from '../modules/message';


const postActionsHandler = ({ store, action }) => {
  if (action.type !== POST_ACTIONS_SUCCESS) {
    return;
  }

  const { meta: { previousAction: { payload: { message } } } } = action;
  store.dispatch(requestMessage({ messageId: message.message_id }));
};

const getListOfCollectionsToInvalidate = (messagesCollections, message) => [
  ...new Set(
    Object.keys(messagesCollections).reduce((acc, type) => [
      ...acc,
      ...Object.keys(messagesCollections[type]).reduce((keyAcc, key) => {
        const collectionId = { type, key };

        return [
          ...keyAcc,
          ...(
            messagesCollections[type][key].messages.indexOf(message.message_id) !== -1 ?
            [collectionId] :
            []
          ),
        ];
      }, []),
    ], []),
  ),
];

const deleteActionHandler = ({ store, action }) => {
  if (action.type !== DELETE_MESSAGE_SUCCESS) {
    return;
  }

  const { meta: { previousAction: { payload: { message } } } } = action;
  const state = store.getState();
  getListOfCollectionsToInvalidate(state.message.messagesCollections, message)
    .forEach(({ type, key }) => store.dispatch(invalidate(type, key)));
};

export default store => next => (action) => {
  const result = next(action);

  postActionsHandler({ store, action });
  deleteActionHandler({ store, action });

  return result;
};
