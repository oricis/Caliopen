import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get messages'),
  post: createAction('Post message'),
};

const selectors = {
  all: () => state => state.messages,
  last: () => state => [...state.messages].pop(),
  byDiscussionId: ({ discussion_id }) => createSelector(
    selectors.all(),
    messages => messages.filter(message => message.discussion_id === discussion_id)
  ),
  lastLocation: () => createSelector(
    selectors.last(),
    message => ({ location: `/api/v1/messages/${message.message_id}` })
  )
};

const reducer = {
  [actions.get]: state => state,
  [actions.post]: (state, params) => ([
    ...state,
    { ...params.body, message_id: uuidv1(), is_draft: true, is_unread: false, type: 'email' },
  ]),
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.byDiscussionId,
    status: 200,
    middlewares: [createCollectionMiddleware('messages')],
  },
  'POST /': {
    action: actions.post,
    selector: selectors.lastLocation,
    status: 200,
  },
};

export default {
  name: 'messages',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/messages',
  routes: routes,
};
