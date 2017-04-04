import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get messages'),
};

const selectors = {
  all: () => state => state.messages,
  byDiscussionId: ({ discussion_id }) => createSelector(
    selectors.all(),
    messages => messages.filter(message => message.discussion_id === discussion_id)
  ),
};

const reducer = {
  [actions.get]: state => state,
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.byDiscussionId,
    status: 200,
    middlewares: [createCollectionMiddleware('messages')],
  },
};

export default {
  name: 'messages',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/messages',
  routes: routes,
};
