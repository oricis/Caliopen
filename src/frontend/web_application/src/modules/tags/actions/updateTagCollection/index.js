import { updateTags as updateMessageTags, requestMessage } from '../../../../store/modules/message';
import { updateTags as updateContactTags, requestContact } from '../../../../store/modules/contact';
import { handleAxiosErrors } from '../../../error';

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
  try {
    await dispatch(getUpdateAction(type)({ [type]: entity, tags }));
  } catch (err) {
    return handleAxiosErrors(err);
  }
  const { payload: { data: entityUptoDate } } = await dispatch(getRequestEntityAct(type)(entity[`${type}_id`]));

  return entityUptoDate.tags;
};
