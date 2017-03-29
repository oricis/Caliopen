// import calcObjectForPatch from '../../services/api-patch';
export const REQUEST_DISCUSSIONS = 'co/discussion/REQUEST_DISCUSSIONS';
export const REQUEST_DISCUSSIONS_SUCCESS = 'co/discussion/REQUEST_DISCUSSIONS_SUCCESS';
export const REQUEST_DISCUSSIONS_FAIL = 'co/discussion/REQUEST_DISCUSSIONS_FAIL';
export const INVALIDATE_DISCUSSIONS = 'co/discussion/INVALIDATE_DISCUSSIONS';
export const LOAD_MORE_DISCUSSIONS = 'co/discussion/LOAD_MORE_DISCUSSIONS';
export const REQUEST_DISCUSSION = 'co/discussion/REQUEST_DISCUSSION';
export const UPDATE_DISCUSSION = 'co/discussion/UPDATE_DISCUSSION';
export const REMOVE_DISCUSSION = 'co/discussion/REMOVE_DISCUSSION';

export function requestDiscussions(params = {}) {
  const { offset = 0, limit = 20 } = params;

  return {
    type: REQUEST_DISCUSSIONS,
    payload: {
      request: {
        url: '/v1/discussions',
        params: { offset, limit },
      },
    },
  };
}

export function loadMoreDiscussions() {
  return {
    type: LOAD_MORE_DISCUSSIONS,
    payload: {},
  };
}

export function requestDiscussion({ discussionId }) {
  return {
    type: REQUEST_DISCUSSION,
    payload: {
      request: {
        url: `/v1/discussions/${discussionId}`,
      },
    },
  };
}

export function invalidate() {
  return {
    type: INVALIDATE_DISCUSSIONS,
    payload: {},
  };
}

export function updateDiscussion({ discussion, original }) {
  console.log(discussion, original);
  // const data = calcObjectForPatch(discussion, original);
  //
  // return {
  //   type: UPDATE_DISCUSSION,
  //   payload: {
  //     request: {
  //       method: 'patch',
  //       url: `/v1/discussions/${discussion.discussion_id}`,
  //       data,
  //     },
  //   },
  // };
}

function discussionsByIdReducer(state = {}, action = {}) {
  return action.payload.data.discussions.reduce((previousState, discussion) => ({
    ...previousState,
    [discussion.discussion_id]: discussion,
  }), state);
}

function discussionIdsReducer(state = [], action = {}) {
  if (action.type !== REQUEST_DISCUSSIONS_SUCCESS) {
    return state;
  }

  return [...state]
    .concat(action.payload.data.discussions.map(discussion => discussion.discussion_id))
    .reduce((prev, curr) => {
      if (prev.indexOf(curr) === -1) {
        prev.push(curr);
      }

      return prev;
    }, []);
}

export function getNextOffset(state) {
  return state.discussions.length;
}

export function hasMore(state) {
  return state.total > state.discussions.length;
}

const initialState = {
  isFetching: false,
  didInvalidate: false,
  discussionsById: {},
  discussions: [],
  total: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_DISCUSSIONS:
      return { ...state, isFetching: true };
    case REQUEST_DISCUSSIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        discussions: discussionIdsReducer(
          state.didInvalidate === true ? [] : state.discussions,
          action
        ),
        discussionsById: discussionsByIdReducer(
          state.didInvalidate === true ? {} : state.discussionsById,
          action
        ),
        total: action.payload.data.total,
      };
    case INVALIDATE_DISCUSSIONS:
      return { ...state, didInvalidate: true };
    default:
      return state;
  }
}
