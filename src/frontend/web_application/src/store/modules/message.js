import calcObjectForPatch from '../../services/api-patch';

export const REQUEST_MESSAGES = 'co/message/REQUEST_MESSAGES';
export const REQUEST_MESSAGES_SUCCESS = 'co/message/REQUEST_MESSAGES_SUCCESS';
export const REQUEST_MESSAGES_FAIL = 'co/message/REQUEST_MESSAGES_FAIL';
export const INVALIDATE_MESSAGES = 'co/message/INVALIDATE_MESSAGES';
export const LOAD_MORE_MESSAGES = 'co/message/LOAD_MORE_MESSAGES';
export const REQUEST_MESSAGE = 'co/message/REQUEST_MESSAGE';
export const UPDATE_MESSAGE = 'co/message/UPDATE_MESSAGE';
export const REMOVE_MESSAGE = 'co/message/REMOVE_MESSAGE';

export function requestMessages(parameters = {}) {
  const { offset = 0, limit = 20, discussionId } = parameters;
  const params = { offset, limit };
  if (discussionId) {
    params.discussion_id = discussionId;
  }

  return {
    type: REQUEST_MESSAGES,
    payload: {
      request: {
        url: '/v1/messages',
        params,
      },
    },
  };
}

export function loadMoreMessages() {
  return {
    type: LOAD_MORE_MESSAGES,
    payload: {},
  };
}

export function invalidate() {
  return {
    type: INVALIDATE_MESSAGES,
    payload: {},
  };
}

export function updateMessage({ message, original }) {
  const data = calcObjectForPatch(message, original);

  return {
    type: UPDATE_MESSAGE,
    payload: {
      request: {
        method: 'patch',
        url: `/v1/messages/${message.message_id}`,
        data,
      },
    },
  };
}

function messagesByIdReducer(state = {}, action = {}) {
  return action.payload.data.messages.reduce((previousState, message) => ({
    ...previousState,
    [message.message_id]: message,
  }), state);
}

function messageIdsReducer(state = [], action = {}) {
  if (action.type !== REQUEST_MESSAGES_SUCCESS) {
    return state;
  }

  return [...state]
    .concat(action.payload.data.messages.map(message => message.message_id))
    .reduce((prev, curr) => {
      if (prev.indexOf(curr) === -1) {
        prev.push(curr);
      }

      return prev;
    }, []);
}

export function getNextOffset(state) {
  return state.messages.length;
}

export function hasMore(state) {
  return state.total > state.messages.length;
}

const initialState = {
  isFetching: false,
  didInvalidate: false,
  messagesById: {},
  messages: [],
  total: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_MESSAGES:
      return { ...state, isFetching: true };
    case REQUEST_MESSAGES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        messages: messageIdsReducer(
          state.didInvalidate === true ? [] : state.messages,
          action
        ),
        messagesById: messagesByIdReducer(
          state.didInvalidate === true ? {} : state.messagesById,
          action
        ),
        total: action.payload.data.total,
      };
    case INVALIDATE_MESSAGES:
      return { ...state, didInvalidate: true };
    default:
      return state;
  }
}
