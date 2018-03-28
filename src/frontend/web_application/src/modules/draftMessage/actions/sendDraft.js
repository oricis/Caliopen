import { postActions } from '../../../store/modules/message';

export const sendDraft = ({ draft: message }) => postActions({ message, actions: ['send'] });
