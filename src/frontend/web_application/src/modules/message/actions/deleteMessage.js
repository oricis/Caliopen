import { deleteMessage as deleteMessageBase, removeFromCollection, invalidateAll } from '../../../store/modules/message';

export const deleteMessage = ({ message }) => async (dispatch) => {
  await dispatch(removeFromCollection({ message }));

  try {
    return dispatch(deleteMessageBase({ message }));
  } catch (err) {
    await dispatch(invalidateAll());

    return Promise.reject(err);
  }
};
