import { createAction, createSelector } from 'bouchon';
import { v1 as uuidv1 } from 'uuid';
import createCollectionMiddleware from '../collection-middleware';

export const actions = {
  get: createAction('Get devices'),
  createOnSignin: createAction('Create device'),
  delete: createAction('Delete a device'),
  patch: createAction('Patch a device'),
  reqVerif: createAction('Req Verif of a device'),
  verify: createAction('Verify'),
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
  [actions.reqVerif]: (state, { params, body }) => {
    const original = state.find(device => device.device_id === params.device_id);
    if (!original) {
      throw `device w/ id ${params.device_id} not found`;
    }
    const { actions } = body;

    if (actions[0] !== 'device-validation') {
      throw new Error('Unknown action');
    }

    return state;
  },
};

const routes = {
  'GET /devices/': {
    action: actions.get,
    selector: selectors.all,
    status: 200,
    middlewares: [createCollectionMiddleware('devices')],
  },
  'GET /devices/:device_id': {
    action: actions.get,
    selector: selectors.byId,
    status: 200,
  },
  'DELETE /devices/:device_id': {
    action: actions.delete,
    status: 204,
  },
  'PATCH /devices/:device_id': {
    action: actions.patch,
    status: 204,
  },
  'POST /devices/:device_id/actions': {
    action: actions.reqVerif,
    status: 204,
  },
  'GET /validate-device/:token': {
    action: actions.verify,
    status: 204,
    middlewares: [data => (req, res, next) => {
      if (req.params.token === 'fail') {
        res.status(500);

        return;
      }
      if (req.params.token !== 'aaaa-bbbb') {
        res.status(404);

        return;
      }
    }],
  },
};

export default {
  name: 'devices',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v2',
  routes: routes,
};
