export const REQUEST_TABS = 'co/tab/REQUEST_TABS';
export const ADD_TAB = 'co/tab/ADD_TAB';
export const REMOVE_TAB = 'co/tab/REMOVE_TAB';
export const SELECT_OR_ADD_TAB = 'co/tab/SELECT_OR_ADD_TAB';

export function requestTabs() {
  return {
    type: REQUEST_TABS,
    payload: {},
  };
}

export function addTab(tab) {
  return {
    type: ADD_TAB,
    payload: { tab },
  };
}

export function selectOrAdd(tab) {
  return {
    type: SELECT_OR_ADD_TAB,
    payload: { tab },
  };
}

export function removeTab(tab) {
  return {
    type: REMOVE_TAB,
    payload: { tab },
  };
}

const initialState = {
  tabs: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_TAB:
      return {
        ...state,
        tabs: [...state.tabs, action.payload.tab],
      };
    case REMOVE_TAB:
      return {
        ...state,
        tabs: state.filter(currentTab => currentTab !== action.payload.tab),
      };
    default:
      return state;
  }
}
