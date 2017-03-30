import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get discussions'),
};

const selectors = {
  all: () => state => state.discussions,
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
};

export default {
  name: 'discussions',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/discussions',
  routes: routes,
};
