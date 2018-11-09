import { createAction, createSelector } from 'bouchon';
import { actions as remoteIdentActions } from '../remote_identities';

const actions = {
  get: createAction('Get remote_identities'),
};

const routes = {
  'GET /:providerName': {
    action: [remoteIdentActions.createOauth, actions.get],
    status: 200,
    middlewares: [data => (req, res, next) => {
      const providerName = req.params.providerName;

      switch (providerName) {
        case 'gmail':
        case 'twitter':
          res.send(`<div><a href="/api/v2/providers/${providerName}/callback">authorize ${providerName}</a></div>`);
          break;
        default:
          throw new Error('provider not found');
      }
    }],
  },
};

export default {
  name: 'oauth-mock',
  endpoint: '/api/oauth-mock',
  routes: routes,
};
