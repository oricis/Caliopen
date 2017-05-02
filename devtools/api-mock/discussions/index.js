import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get discussions'),
};

const selectors = {
  all: () => state => state.discussions,
  byId: ({ discussion_id }) => createSelector(
    selectors.all(),
    discussions => discussions.find(discussion => discussion.discussion_id === discussion_id)
  ),
};

const reducer = {
  [actions.get]: state => state,
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
    middlewares: [createCollectionMiddleware('discussions')],
  },
  'GET /:discussion_id': {
    action: actions.get,
    selector: selectors.byId,
    status: 200,
  },
};

export default {
  name: 'discussions',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/discussions',
  routes: routes,
};
