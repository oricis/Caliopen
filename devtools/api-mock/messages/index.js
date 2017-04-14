import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get messages'),
  post: createAction('Post message'),
  patch: createAction('Patch message'),
  actions: createAction('Actions message'),
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
  ),
  byId: ({ message_id }) => createSelector(
    selectors.all(),
    messages => messages.find(message => message.message_id === message_id)
  ),
};

const reducer = {
  [actions.get]: state => state,
  [actions.post]: (state, params) => ([
    ...state,
    {
      ...params.body,
      message_id: uuidv1(),
      'participants': [
        { 'type': 'Cc', 'contact_ids': ['1039cdcc-1f6f-4b5d-9c8a-5d7c711f357f'], 'address': 'test@caliopen.local', 'protocol': 'email' },
        { 'type': 'From', 'contact_ids': ['c-john-01'], 'address': 'john@caliopen.local', 'protocol': 'email' },
        { 'type': 'To', 'address': 'zoidberg@planet-express.tld', 'protocol': 'email' },
      ],
      is_draft: true,
      is_unread: false,
      type: 'email',
      date: Date.now(),
      date_insert: Date.now(),
    },
  ]),
  [actions.patch]: (state, { params, body }) => {
    const nextState = [...state];
    const original = state.find(message => message.message_id === params.message_id);
    if (!original) {
      throw `message w/ id ${params.message_id} not found`;
    }
    const index = nextState.indexOf(original);
    const { current_state, ...props } = body;
    nextState[index] = {
      ...original,
      ...props,
    };

    return nextState;
  },
  [actions.actions]: (state, { params, body }) => {
    const original = state.find(message => message.message_id === params.message_id);
    if (!original) {
      throw `message w/ id ${params.message_id} not found`;
    }
    const index = state.indexOf(original);

    return body.actions.reduce((acc, action) => {
      switch (action) {
        case 'send':
          acc[index] = { ...acc[index], is_draft: false, date: Date.now() };

          return acc;
        default:
          throw new Error(`Unexpected action "${action}"`);
      }
    }, [...state]);
  },
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.byDiscussionId,
    status: 200,
    middlewares: [createCollectionMiddleware('messages')],
  },
  'GET /:message_id': {
    action: actions.get,
    selector: selectors.byId,
    status: 200,
  },
  'POST /:message_id/actions': {
    action: actions.actions,
    selector: selectors.byId,
    status: 200,
  },
  'POST /': {
    action: actions.post,
    selector: selectors.lastLocation,
    status: 200,
  },
  'PATCH /:message_id': {
    action: actions.patch,
    status: 204,
  },
};

export default {
  name: 'messages',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/messages',
  routes: routes,
};
