import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

import initialData from './data.json';

const actions = {
  get: createAction('Get notifications'),
  delete: createAction('Delete notifications'),
  resetDev: createAction('Reset fixtures for dev purposes (see tests)'),
};

const selectors = {
  all: () => state => state.notifications,
};

const reducer = {
  [actions.delete]: (state) => {
    return {
      ...state,
      total: 0,
      notifications: [],
    };
  },
  [actions.resetDev]: () => {
    return {
      ...initialData,
    };
  },
};

const routes = {
  'GET': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
  },
  'DELETE': {
    action: actions.delete,
    status: 204,
  },
  'GET /reset-dev': {
    action: actions.resetDev,
    status: 200,
  },
};

export default {
  name: 'notifications',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v2/notifications',
  routes: routes,
};
