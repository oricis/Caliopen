import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
};

const match = ({ item, props, searchTerms }) => props.find(propName =>
      item[propName] && item[propName].toLowerCase().includes(searchTerms.toLowerCase()));

const selectors = {
  all: () => state => state.participants,
  byQuery: ({ context, q }) => createSelector(
    selectors.all(),
    participants => participants.filter(item => match({
      item, searchTerms: q, props: ['address', 'label'],
    }))
  ),
};

const reducer = {
};

const routes = {
  'GET /suggest': {
    action: actions.get,
    selector: selectors.byQuery,
    status: 200,
  },
};

export default {
  name: 'participants',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v2/participants',
  routes: routes,
};
