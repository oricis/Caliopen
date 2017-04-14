import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get local_identities'),
};

const selectors = {
  all: () => state => state.local_identities,
};

const reducer = {
  [actions.get]: state => state,
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
    middlewares: [createCollectionMiddleware('local_identities')],
  },
};

export default {
  name: 'local_identities',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v2/identities/locals',
  routes: routes,
};
