// @flow
import { createMessage as createMessageBase, requestMessage, addToCollection } from '../../../store/modules/message';
import { tryCatchAxiosAction } from '../../../services/api-client';

/* ::
 type Message = {
   message_id: string
 }
*/

/* ::
  type createMessageType = ({ message: Message }) => (dispatch: function) => Promise<Message>
*/
export const createMessage /* : createMessageType */ = ({ message }) => async (dispatch) => {
  await dispatch(createMessageBase({ message }));
  const messageUpToDate = await tryCatchAxiosAction(() =>
    dispatch(requestMessage(message.message_id)));

  await dispatch(addToCollection({ message: messageUpToDate }));

  return messageUpToDate;
};
