import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get settings'),
  patch: createAction('Patch settings'),
};

const selectors = {
  all: () => state => state.settings,
};

const reducer = {
  [actions.patch]: (state, { params, body }) => {
    const { current_state, ...props } = body;

    return  {
      ...state,
      ...props,
    };
  },
};

const routes = {
  'GET': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
  },
  'PATCH': {
    action: actions.patch,
    status: 204,
  },
};

export default {
  name: 'settings',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/settings',
  routes: routes,
};
