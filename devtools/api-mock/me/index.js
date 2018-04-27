import { createAction, createSelector } from 'bouchon';

const actions = {
  get: createAction('me'),
  patch: createAction('patch'),
};

const selectors = {
  all: () => state => state.me,
};

const reducer = {
  [actions.get]: state => state,
};

const routes = {
  'GET /v1/me/': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
  },
  'PATCH /v2/users/:user_id/': {
    action: actions.patch,
    status: 204,
  },
};

export default {
  name: 'me',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api',
  routes: routes,
};
