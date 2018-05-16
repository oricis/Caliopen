import { uploadAttachment, requestMessage } from '../../../store/modules/message';
import { tryCatchAxiosPromise } from '../../../services/api-client';

export const uploadDraftAttachments = ({ message, attachments }) => async (dispatch) => {
  try {
    await Promise.all(attachments.map(file =>
      tryCatchAxiosPromise(dispatch(uploadAttachment({ message, attachment: file })))));

    return tryCatchAxiosPromise(dispatch(requestMessage(message.message_id)));
  } catch (err) {
    return Promise.reject(err);
  }
};
