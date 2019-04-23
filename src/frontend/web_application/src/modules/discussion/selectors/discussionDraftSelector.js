import { createSelector } from 'reselect';
import { sortMessages } from '../../../modules/message';
import { createMessageCollectionStateSelector } from '../../../store/selectors/message';
import { discussionIdSelector } from './discussionIdSelector';

const messageCollectionSelector = createMessageCollectionStateSelector(() => 'discussion', discussionIdSelector);

export const discussionDraftSelector = (state, { discussionId }) => createSelector(
  [messageCollectionSelector],
  ({ messages }) => {
    const [draft] = sortMessages(messages, true)
      .filter(message => message.is_draft === true);

    return draft;
  }
)(state, { discussionId });
