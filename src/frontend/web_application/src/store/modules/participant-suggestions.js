export const SUGGEST = 'co/participant-suggestions/SUGGEST';
export const SUGGEST_SUCCESS = 'co/participant-suggestions/SUGGEST_SUCCESS';

export function suggest(terms, context = 'msg_compose') {
  return {
    type: SUGGEST,
    payload: {
      request: {
        url: '/v2/participants/suggest',
        params: { q: terms, context },
      },
    },
  };
}

const initialState = {
  isFetching: false,
  resultsBySearchTerms: {},
  searchTermsById: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SUGGEST:
      return { ...state, isFetching: true };
    case SUGGEST_SUCCESS:
      return {
        ...state,
        resultsBySearchTerms: {
          [action.meta.previousAction.payload.request.params.q]: action.payload.data,
        },
      };
    default:
      return state;
  }
}
