export const REQUEST_DRAFT = 'co/draft-message/REQUEST_DRAFT';
export const REQUEST_DRAFT_SUCCESS = 'co/draft-message/REQUEST_DRAFT_SUCCESS';
export const REQUEST_SIMPLE_DRAFT = 'co/draft-message/REQUEST_SIMPLE_DRAFT';
export const REQUEST_SIMPLE_DRAFT_SUCCESS = 'co/draft-message/REQUEST_SIMPLE_DRAFT_SUCCESS';
export const EDIT_SIMPLE_DRAFT = 'co/draft-message/EDIT_SIMPLE_DRAFT';
export const CLEAR_SIMPLE_DRAFT = 'co/draft-message/CLEAR_SIMPLE_DRAFT';
export const CREATE_DRAFT_SUCCESS = 'co/draft-message/CREATE_DRAFT_SUCCESS';
export const EDIT_DRAFT = 'co/draft-message/EDIT_DRAFT';
export const SAVE_DRAFT = 'co/draft-message/SAVE_DRAFT';
export const SEND_DRAFT = 'co/draft-message/SEND_DRAFT';
export const SEND_DRAFT_SUCCESS = 'co/draft-message/SEND_DRAFT_SUCCESS';
export const CLEAR_DRAFT = 'co/draft-message/CLEAR_DRAFT';

export function editDraft({ discussionId, draft, message }) {
  return {
    type: EDIT_DRAFT,
    payload: { discussionId, draft, original: message },
  };
}

export function saveDraft({ discussionId, draft, message }) {
  return {
    type: SAVE_DRAFT,
    payload: { discussionId, draft, original: message },
  };
}

export function draftCreated({ draft }) {
  return {
    type: CREATE_DRAFT_SUCCESS,
    payload: { draft },
  };
}

export function requestDraft({ discussionId }) {
  return {
    type: REQUEST_DRAFT,
    payload: { discussionId },
  };
}

export function requestDraftSuccess({ draft }) {
  return {
    type: REQUEST_DRAFT_SUCCESS,
    payload: { draft },
  };
}

export function requestSimpleDraft() {
  return {
    type: REQUEST_SIMPLE_DRAFT,
    payload: { },
  };
}

export function requestSimpleDraftSuccess({ draft }) {
  return {
    type: REQUEST_SIMPLE_DRAFT_SUCCESS,
    payload: { draft },
  };
}

export function editSimpleDraft({ draft }) {
  return {
    type: EDIT_SIMPLE_DRAFT,
    payload: { draft },
  };
}

export function clearSimpleDraft() {
  return {
    type: CLEAR_SIMPLE_DRAFT,
    payload: {},
  };
}

export function sendDraft({ discussionId, draft, message }) {
  return {
    type: SEND_DRAFT,
    payload: { discussionId, draft, original: message },
  };
}

export function clearDraft({ discussionId }) {
  return {
    type: CLEAR_DRAFT,
    payload: { discussionId },
  };
}

function draftReducer(state = { participants: [] }, action) {
  switch (action.type) {
    case REQUEST_SIMPLE_DRAFT_SUCCESS:
    case REQUEST_DRAFT_SUCCESS:
    case EDIT_DRAFT:
    case EDIT_SIMPLE_DRAFT:
    case CREATE_DRAFT_SUCCESS:
      return {
        ...state,
        ...action.payload.draft,
      };
    case SEND_DRAFT_SUCCESS:
      throw new Error('TODO reducer SEND_DRAFT_SUCCESS');
    default:
      return state;
  }
}

function dratfsByDiscussionIdReducer(state, action) {
  switch (action.type) {
    case CREATE_DRAFT_SUCCESS:
    case REQUEST_DRAFT_SUCCESS:
    case SEND_DRAFT_SUCCESS:
      return {
        ...state,
        [action.payload.draft.discussion_id]:
          draftReducer(state[action.payload.draft.discussion_id], action),
      };
    case EDIT_DRAFT:
      return {
        ...state,
        [action.payload.discussionId]: draftReducer(state[action.payload.discussionId], action),
      };
    case CLEAR_DRAFT:
      return {
        ...state,
        [action.payload.discussionId]: undefined,
      };
    default:
      return state;
  }
}

const initialState = {
  isFetching: false,
  didInvalidate: false,
  draftsByDiscussionId: {},
  simpleDraft: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_DRAFT_SUCCESS:
    case EDIT_DRAFT:
    case REQUEST_DRAFT_SUCCESS:
    case SEND_DRAFT_SUCCESS:
    case CLEAR_DRAFT:
      return {
        ...state,
        draftsByDiscussionId: dratfsByDiscussionIdReducer(state.draftsByDiscussionId, action),
      };
    case EDIT_SIMPLE_DRAFT:
    case REQUEST_SIMPLE_DRAFT_SUCCESS:
      return {
        ...state,
        simpleDraft: draftReducer(state.simpleDraft, action),
      };
    case CLEAR_SIMPLE_DRAFT:
      return {
        ...state,
        simpleDraft: undefined,
      };
    default:
      return state;
  }
}
