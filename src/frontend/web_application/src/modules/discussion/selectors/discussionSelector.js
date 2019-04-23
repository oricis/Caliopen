import { getModuleStateSelector } from '../../../store/selectors/getModuleStateSelector';

export const discussionSelector = (state, { discussionId }) => getModuleStateSelector('discussion')(state).discussionsById[discussionId];
