export const SWITCH_APPLICATION = 'co/application/SWITCH_APPLICATION';
export const REFRESH_APPLICATION = 'co/application/REFRESH_APPLICATION';

export function switchApplication(applicationName) {
  return {
    type: SWITCH_APPLICATION,
    payload: { applicationName },
  };
}

export function refreshApp(applicationName) {
  return {
    type: REFRESH_APPLICATION,
    payload: { applicationName },
  };
}

const initialState = { applicationName: 'discussions' };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SWITCH_APPLICATION:
      return { applicationName: action.payload.applicationName };
    default:
      return state;
  }
}
