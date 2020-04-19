import { getModuleStateSelector } from '../../../store/selectors/getModuleStateSelector';

export const messageSelector = (state, { messageId }) =>
  getModuleStateSelector('message')(state).messagesById[messageId];
