import { updateTags as updateMessageTags, requestMessage } from '../../../../store/modules/message';
import { updateTags as updateContactTags, requestContact } from '../../../../store/modules/contact';

const getUpdateAction = (type) => {
  switch (type) {
    case 'message':
      return updateMessageTags;
    case 'contact':
      return updateContactTags;
    default:
      throw new Error(`Entity ${type} not supported`);
  }
};

const getRequestEntityAct = (type) => {
  switch (type) {
    case 'message':
      return requestMessage;
    case 'contact':
      return requestContact;
    default:
      throw new Error(`Entity ${type} not supported`);
  }
};

export const updateTagCollection = (type, entity, { tags }) => async (dispatch) => {
  await dispatch(getUpdateAction(type)({ [type]: entity, tags }));
  const { payload: { data: entityUptoDate } } = await dispatch(getRequestEntityAct(type)(entity[`${type}_id`]));

  return entityUptoDate.tags;
};
