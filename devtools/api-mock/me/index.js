import { createAction, createSelector } from 'bouchon';

const actions = {
  get: createAction('me'),
};

const selectors = {
  all: () => state => state.me,
};

const reducer = {
  [actions.get]: state => state,
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
  },
};

export default {
  name: 'me',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/me',
  routes: routes,
};
