import { updateTags as updateMessageTags, requestMessage } from '../../../../store/modules/message';

const getUpdateAction = (type) => {
  switch (type) {
    case 'message':
      return updateMessageTags;
    default:
      throw new Error(`Entity ${type} not supported`);
  }
};

const getRequestEntityAct = (type) => {
  switch (type) {
    case 'message':
      return requestMessage;
    default:
      throw new Error(`Entity ${type} not supported`);
  }
};

export const updateTagCollection = (type, entity, { tags }) => async (dispatch) => {
  await dispatch(getUpdateAction(type)({ [type]: entity, tags }));
  const { payload: { data: entityUptoDate } } = await dispatch(getRequestEntityAct(type)(entity[`${type}_id`]));

  return entityUptoDate.tags;
};
