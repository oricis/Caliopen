import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

export const actions = {
  get: createAction('Get remote_identities'),
  post: createAction('post remote_identities'),
  createOauth: createAction('post remote_identities'),
  patch: createAction('patch remote_identities'),
  delete: createAction('delete remote_identities'),
};

const selectors = {
  all: () => state => state.remote_identities,
  last: () => state => [...state.remote_identities].pop(),
  lastLocation: () => createSelector(
    selectors.last(),
    ({ identity_id }) => ({
      location: `/api/v2/remote_identity/${identity_id}`,
      identity_id,
      // FIXME: to del; backend inconsistency for now
      remote_id: identity_id,
    })
  ),
  byId: ({ identity_id }) => createSelector(
    selectors.all(),
    remoteIdentity => remoteIdentity.find(identity => identity.identity_id === identity_id)
  ),
};

const reducer = {
  [actions.get]: state => state,
  [actions.post]: (state, { body }) => ([
    ...state,
    {
      identity_id: uuidv1(),
      ...body,
    }
  ]),
  [actions.createOauth]: (state, { req }) => {
    const { providerName } = req.params;

    switch (providerName) {
      case 'gmail':
        return [
          ...state,
          {
            identity_id: uuidv1(),
            display_name: 'dev@gmail',
            identifier: 'dev@gmail.com',
            infos: {
              authtype:'oauth2',
              inserver:'imap.gmail.com:993',
              lastseenuid:'',
              lastsync:'',
              outserver:'smtp.gmail.com:465',
              pollinterval:'15',
              provider:'gmail',
              uidvalidity:''
            },
            protocol: 'email',
            status: 'inactive',
            type: 'remote',
          },
        ];
      case 'twitter':
        return [
          ...state,
          {
            identity_id: uuidv1(),
            display_name: '@dev',
            identifier: '@dev',
            infos: {
              authtype:'oauth2',
              lastseenuid:'',
              lastsync:'',
              pollinterval:'15',
              provider:'twitter',
              uidvalidity:''
            },
            protocol: 'twitter',
            status: 'inactive',
            type: 'remote',
          },
        ];
      default:
        throw new Error('unknown provider');
    }
  },
  [actions.patch]: (state, { params, body }) => {
    const nextState = [...state];
    const original = state.find(remoteIdentity => remoteIdentity.identity_id === params.identity_id);
    if (!original) {
      throw `remoteIdentity w/ id ${params.identity_id} not found`;
    }
    const index = nextState.indexOf(original);
    const { current_state, ...props } = body;
    nextState[index] = {
      ...original,
      ...props,
    };

    return nextState;
  },
  [actions.delete]: (state, { params, body }) => {
    const original = state.find(remoteIdentity => remoteIdentity.identity_id === params.identity_id);
    if (!original) {
      throw `remoteIdentity w/ id ${params.identity_id} not found`;
    }

    return [...state.filter(remoteIdentity => remoteIdentity.identity_id !== params.identity_id)];
  },
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
    middlewares: [createCollectionMiddleware('remote_identities')],
  },
  'POST /': {
    action: actions.post,
    selector: selectors.lastLocation,
    status: 200,
  },
  'GET /:identity_id': {
    action: actions.get,
    selector: selectors.byId,
    status: 200,
  },
  'PATCH /:identity_id': {
    action: actions.patch,
    status: 204,
  },
  'DELETE /:identity_id': {
    action: actions.delete,
    selector: selectors.byId,
    status: 204,
  },
};

export default {
  name: 'remote_identities',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v2/identities/remotes',
  routes: routes,
};
