export const SEARCH = 'co/search/SEARCH';
export const SEARCH_SUCCESS = 'co/search/SEARCH_SUCCESS';

export function search({ term, doctype }) {
  return {
    type: SEARCH,
    payload: {
      request: {
        url: '/v2/search',
        params: { term, doctype },
      },
    },
  };
}

export const getKey = (term, doctype = '') => `${doctype}_${term}`;

const initialState = {
  resultsByKey: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH:
      return { ...state, isFetching: true };
    case SEARCH_SUCCESS:
      return {
        ...state,
        resultsByKey: {
          [getKey(action.payload.term, action.payload.type)]: action.payload.results,
        },
      };
    default:
      return state;
  }
}
