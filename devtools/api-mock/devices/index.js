import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

export const actions = {
  get: createAction('Get devices'),
  createOnSignin: createAction('Create device'),
  delete: createAction('Delete a device'),
  patch: createAction('Patch a device'),
  reqVerif: createAction('Req Verif of a device'),
};

export const selectors = {
  all: () => state => state.devices,
  last: () => state => [...state.devices].pop(),
  byId: ({ device_id }) => createSelector(
    selectors.all(),
    devices => devices.find(device => device.device_id === device_id)
  ),
  location: () => createSelector(
    selectors.last(),
    device => ({ location: `/api/v2/devices/${device.device_id}` })
  ),
};

const devicesToIgnore = new Set(['00001']);

const reducer = {
  [actions.createOnSignin]: (state, { body, req }) => {
    const { device_id } = body.device;
    const hasDevice = state.some(device => device.device_id === device_id);
    const hasVerifiedDevice = state
      .filter(device => !devicesToIgnore.has(device.device_id))
      .some(device => device.status === 'verified');

    if (hasDevice) {
      return state;
    }

    const device = {
      ...body.device,
      status: !hasVerifiedDevice ? 'verified' : 'unverified',
      name: !hasVerifiedDevice ? 'default' : `desktop ${state.length}`,
    };

    return [
      ...state,
      device,
    ];
  },
  [actions.get]: state => state,
  [actions.delete]: (state, { params }) => {
    const copy = state.slice(0);
    return [...state].filter(device => device.device_id !== params.device_id);
  },
  [actions.patch]: (state, { params, body }) => {
    const nextState = [...state];
    const original = state.find(device => device.device_id === params.device_id);
    if (!original) {
      throw `device w/ id ${params.device_id} not found`;
    }
    const index = nextState.indexOf(original);
    const { current_state, ...props } = body;
    nextState[index] = {
      ...original,
      ...props,
    };

    return nextState;
  },
  [actions.patch]: (state, { params, body }) => {
    const original = state.find(device => device.device_id === params.device_id);
    if (!original) {
      throw `device w/ id ${params.device_id} not found`;
    }
    const { actions } = body;

    if (actions[0] !== 'device-validation') {
      throw new Error('Unknown action');
    }

    return state;
  }
};

const routes = {
  'GET /': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
    middlewares: [createCollectionMiddleware('devices')],
  },
  'GET /:device_id': {
    action: actions.get,
    selector: selectors.byId,
    status: 200,
  },
  'DELETE /:device_id': {
    action: actions.delete,
    status: 204,
  },
  'PATCH /:device_id': {
    action: actions.patch,
    status: 204,
  },
  'POST /:device_id/actions': {
    action: actions.reqVerif,
    status: 204,
  },
};

export default {
  name: 'devices',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v2/devices',
  routes: routes,
};
