import { requestMessages as requestMessagesBase } from '../../../store/modules/message';
import { tryCatchAxiosAction } from '../../../services/api-client';

export const requestMessages = (...params) => dispatch =>
  tryCatchAxiosAction(() => dispatch(requestMessagesBase(...params)));
