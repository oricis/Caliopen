import { uploadAttachment, requestMessage } from '../../../store/modules/message';
import { tryCatchAxiosPromise } from '../../../services/api-client';

export const uploadDraftAttachments = ({ message, attachments }) => async (dispatch) => {
  if (typeof FormData !== 'function') {
    throw new Error('not a browser environment');
  }

  const results = await Promise.all(attachments.map((file) => {
    const attachment = new FormData();
    attachment.append('attachment', file);

    return tryCatchAxiosPromise(dispatch(uploadAttachment({ message, attachment })));
  }));

  await dispatch(requestMessage(message.message_id));

  return results;
};
