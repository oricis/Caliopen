import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

const actions = {
  get: createAction('Get provider'),
  postRemote: createAction('post remote_identities'),
};

const twitterPopupUrl = 'https://api.twitter.com/oauth/authorize?oauth_token=<token>';

const selectors = {
  all: () => state => state.providers,
  byId: ({ providerName }) => createSelector(
    selectors.all(),
    providers => {
      const result = providers.find(provider => provider.name === providerName);

      if (!result) {
        throw new Error('provider not found');
      }

      return {
        ...result,
        oauth_callback_uri: `/api/v2/providers/${providerName}/callback`,
        oauth_request_url: `http://localhost:4000/api/oauth-mock/${providerName}`,
      };
    }
  ),
  none: () => state => {},
};

const reducer = {
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
    middlewares: [createCollectionMiddleware('providers')],
  },
  'GET /:providerName/callback': {
    selector: selectors.none,
    status: 200,
  },
  'GET /:providerName': {
    action: actions.get,
    selector: selectors.byId,
    status: 200,
  },
};

export default {
  name: 'providers',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v2/providers',
  routes: routes,
};
