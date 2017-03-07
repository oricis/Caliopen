import calcObjectForPatch from '../../services/api-patch';

export const REQUEST_DEVICES = 'co/device/REQUEST_DEVICES';
export const REQUEST_DEVICES_SUCCESS = 'co/device/REQUEST_DEVICES_SUCCESS';
export const REQUEST_DEVICES_FAIL = 'co/device/REQUEST_DEVICES_FAIL';
export const INVALIDATE_DEVICES = 'co/device/INVALIDATE_DEVICES';
export const REQUEST_DEVICE = 'co/device/REQUEST_DEVICE';
export const UPDATE_DEVICE = 'co/device/UPDATE_DEVICE';
export const REMOVE_DEVICE = 'co/device/REMOVE_DEVICE';
export const VERIFY_DEVICE = 'co/device/VERIFY_DEVICE';

export function requestDevices() {
  return {
    type: REQUEST_DEVICES,
    payload: {
      request: {
        url: '/v1/devices',
      },
    },
  };
}

export function requestDevice({ deviceId }) {
  return {
    type: REQUEST_DEVICE,
    payload: {
      request: {
        url: `/v1/devices/${deviceId}`,
      },
    },
  };
}

export function invalidate() {
  return {
    type: INVALIDATE_DEVICES,
    payload: {},
  };
}

export function removeDevice({ device }) {
  return {
    type: REMOVE_DEVICE,
    payload: {
      request: {
        method: 'delete',
        url: `/v1/devices/${device.device_id}`,
      },
    },
  };
}

export function verifyDevice({ device }) {
  return {
    type: VERIFY_DEVICE,
    payload: {
      device,
    },
  };
}

export function updateDevice({ device, original }) {
  const data = calcObjectForPatch(device, original);

  return {
    type: UPDATE_DEVICE,
    payload: {
      request: {
        method: 'patch',
        url: `/v1/devices/${device.device_id}`,
        data,
      },
    },
  };
}

function devicesByIdReducer(state, action) {
  switch (action.type) {
    case REQUEST_DEVICES_SUCCESS:
      return action.payload.data.devices.reduce((acc, device) => ({
        ...acc,
        [device.device_id]: device,
      }), {});
    default:
      return state;
  }
}

function devicesReducer(state, action) {
  switch (action.type) {
    case REQUEST_DEVICES_SUCCESS:
      return action.payload.data.devices.map(device => device.device_id);
    default:
      return state;
  }
}

const initialState = {
  isFetching: false,
  didInvalidate: false,
  devices: [],
  devicesById: {},
  total: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_DEVICES:
      return { ...state, isFetching: true };
    case REQUEST_DEVICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        devices: devicesReducer(state.devices, action),
        devicesById: devicesByIdReducer(state.devicesById, action),
        total: action.payload.data.total,
      };
    case INVALIDATE_DEVICES:
      return { ...state, didInvalidate: true };
    default:
      return state;
  }
}
