import { createAction, createSelector } from 'bouchon';

const actions = {
  post: createAction('Authenticate'),
};

const selectors = {
  all: () => state => state.authentications,
};

const reducer = {
  [actions.post]: state => state,
};

const routes = {
  'POST /': {
    action: actions.post,
    selector: selectors.all,
    status: 200,
  },
};

export default {
  name: 'authentications',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/authentications',
  routes: routes,
};
