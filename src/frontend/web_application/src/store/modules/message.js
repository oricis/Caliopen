import calcObjectForPatch from '../../services/api-patch';

export const REQUEST_MESSAGES = 'co/message/REQUEST_MESSAGES';
export const REQUEST_MESSAGES_SUCCESS = 'co/message/REQUEST_MESSAGES_SUCCESS';
export const REQUEST_MESSAGES_FAIL = 'co/message/REQUEST_MESSAGES_FAIL';
export const INVALIDATE_MESSAGES = 'co/message/INVALIDATE_MESSAGES';
export const LOAD_MORE_MESSAGES = 'co/message/LOAD_MORE_MESSAGES';
export const REQUEST_MESSAGE = 'co/message/REQUEST_MESSAGE';
export const UPDATE_MESSAGE = 'co/message/UPDATE_MESSAGE';
export const UPDATE_MESSAGE_SUCCESS = 'co/message/UPDATE_MESSAGE_SUCCESS';
export const UPDATE_MESSAGE_FAIL = 'co/message/UPDATE_MESSAGE_FAIL';
export const REMOVE_MESSAGE = 'co/message/REMOVE_MESSAGE';
export const CREATE_MESSAGE = 'co/message/CREATE_MESSAGE';
export const CREATE_MESSAGE_SUCCESS = 'co/message/CREATE_MESSAGE_SUCCESS';
export const SYNC_MESSAGE = 'co/message/SYNC_MESSAGE';
export const POST_ACTIONS = 'co/message/POST_ACTIONS';
export const POST_ACTIONS_SUCCESS = 'co/message/POST_ACTIONS_SUCCESS';


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

export function createMessage({ message }) {
  return {
    type: CREATE_MESSAGE,
    payload: {
      request: {
        url: '/v1/messages',
        method: 'post',
        data: { ...message },
      },
    },
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

export function syncMessage({ message }) {
  return {
    type: SYNC_MESSAGE,
    payload: { message },
  };
}

export function postActions({ message, actions }) {
  return {
    type: POST_ACTIONS,
    payload: {
      request: {
        method: 'post',
        url: `/v1/messages/${message.message_id}/actions`,
        data: {
          actions,
        },
      },
    },
  };
}

export function getNextOffset(state) {
  return state.messages.length;
}

export function hasMore(state) {
  return state.total > state.messages.length;
}

function messagesByIdReducer(state = {}, action = {}) {
  switch (action.type) {
    case REQUEST_MESSAGES_SUCCESS:
      return action.payload.data.messages.reduce((previousState, message) => ({
        ...previousState,
        [message.message_id]: message,
      }), state);
    case SYNC_MESSAGE:
      return {
        ...state,
        [action.payload.message.message_id]: action.payload.message,
      };
    default:
      return state;
  }
}

function messageIdsByDiscussionIdReducer(state = {}, action = {}) {
  if (action.type !== REQUEST_MESSAGES_SUCCESS) {
    return state;
  }

  const applyMessageId = (messagesState = [], message) => {
    if (messagesState.indexOf(message.message_id) !== -1) {
      return messagesState;
    }

    const nextState = [...messagesState];
    nextState.push(message.message_id);

    return nextState;
  };

  return action.payload.data.messages.reduce((acc, message) => {
    const { discussion_id: discussionId } = message;

    return {
      ...acc,
      [discussionId]: applyMessageId(acc[discussionId], message),
    };
  }, state);
}

const initialState = {
  isFetching: false,
  didInvalidate: false,
  messagesById: {},
  messagesByDiscussionId: {},
  total: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_MESSAGES:
    case CREATE_MESSAGE:
    case UPDATE_MESSAGE:
      return { ...state, isFetching: true };
    case REQUEST_MESSAGES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        messagesByDiscussionId: messageIdsByDiscussionIdReducer(
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
    case SYNC_MESSAGE:
      return {
        ...state,
        messagesById: messagesByIdReducer(state.messagesById, action),
      };
    default:
      return state;
  }
}
