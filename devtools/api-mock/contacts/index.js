import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get contacts'),
  patch: createAction('Patch contact'),
  post: createAction('Post contact'),
  patchTags: createAction('Patch contact\'s tags'),
};

const selectors = {
  all: () => state => state.contacts,
  byId: ({ contact_id }) => createSelector(
    selectors.all(),
    contacts => {
      const contact = contacts.find(contact => contact.contact_id === contact_id);
      if (contact) {
        return contact;
      }

      throw new Error('contact not found');
    }
  ),
  last: () => state => [...state.contacts].pop(),
  lastLocation: () => createSelector(
    selectors.last(),
    contact => ({ location: `/api/v1/contacts/${contact.contact_id}` })
  ),
};

const reducer = {
  [actions.post]: (state, { body }) => ([
    ...state,
    {
      contact_id: uuidv1(),
      ...body,
    },
  ]),
  [actions.patch]: (state, { params, body }) => {
    const nextState = [...state];
    const original = state.find(contact => contact.contact_id === params.contact_id);
    if (!original) {
      throw `contact w/ id ${params.contact_id} not found`;
    }
    const index = nextState.indexOf(original);
    const { current_state, ...props } = body;
    nextState[index] = {
      ...original,
      ...props,
    };

    return nextState;
  },
  [actions.patchTags]: (state, { params, body }) => {
    const original = state.find(contact => contact.contact_id === params.contact_id);
    if (!original) {
      throw `contact w/ id ${params.contact_id} not found`;
    }

    const index = state.indexOf(original);
    const nextState = [...state];
    const { tags } = body;

    nextState[index] = {
      ...original,
      tags,
    };

    return nextState;
  },
};

const routes = {
  'GET /v1/contacts/': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
    middlewares: [createCollectionMiddleware('contacts')],
  },
  'GET /v1/contacts/:contact_id': {
    action: actions.get,
    selector: selectors.byId,
    status: 200,
  },
  'PATCH /v1/contacts/:contact_id': {
    action: actions.patch,
    status: 204,
  },
  'POST /v1/contacts/': {
    action: actions.post,
    selector: selectors.lastLocation,
    status: 200,
  },
  'PATCH /v2/contacts/:contact_id/tags': {
    action: actions.patchTags,
    status: 204,
  },
};

export default {
  name: 'contacts',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api',
  routes: routes,
};
