import { requestMessage, deleteAttachment } from '../../../store/modules/message';
import { tryCatchAxiosPromise } from '../../../services/api-client';

export const deleteDraftAttachment = ({ message, attachment }) => async (dispatch) => {
  const results = tryCatchAxiosPromise(dispatch(deleteAttachment({ message, attachment })));

  await dispatch(requestMessage(message.message_id));

  return results;
};
