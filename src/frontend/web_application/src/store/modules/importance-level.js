export const SET_IMPORTANCE_LEVEL = 'co/importance-level/SET_IMPORTANCE_LEVEL';

const initialState = { range: [0, 100] };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_IMPORTANCE_LEVEL:
      return {
        ...state,
        range: action.payload.range,
      };
    default:
      return state;
  }
}

export function setImportanceLevel(range) {
  return {
    type: SET_IMPORTANCE_LEVEL,
    payload: { range },
  };
}
