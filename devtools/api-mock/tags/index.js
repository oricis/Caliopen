import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get tags'),
  post: createAction('Create tag'),
  delete: createAction('Delete a tag'),
};

const selectors = {
  all: () => state => state.tags,
  last: () => state => [...state.tags].pop(),
  byId: ({ tag_id }) => createSelector(
    selectors.all(),
    tags => tags.find(tag => tag.tag_id === tag_id)
  ),
  location: () => createSelector(
    selectors.last(),
    tag => ({ location: `/api/v1/tags/${tag.tag_id}` })
  ),
};

const reducer = {
  [actions.get]: state => state,
  [actions.post]: (state, params) => ([
    ...state,
    { ...params.body, type: 'user', tag_id: uuidv1() },
  ]),
  [actions.delete]: (state, { params }) => {
    const copy = state.slice(0);
    return [...state].filter(tag => tag.tag_id !== params.tag_id);
  },
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
    middlewares: [createCollectionMiddleware('tags')],
  },
  'POST /': {
    action: actions.post,
    selector: selectors.location,
    status: 200,
  },
  'GET /:tag_id': {
    action: actions.get,
    selector: selectors.byId,
    status: 200,
  },
  'DELETE /:tag_id': {
    action: actions.delete,
    status: 204,
  },
};

export default {
  name: 'tags',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/tags',
  routes: routes,
};
