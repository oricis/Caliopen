import calcObjectForPatch from '../../services/api-patch';

export const REQUEST_USER = 'co/user/REQUEST_USER';
export const REQUEST_USER_SUCCESS = 'co/user/REQUEST_USER_SUCCESS';
export const REQUEST_USER_FAIL = 'co/user/REQUEST_USER_FAIL';
export const UPDATE_USER = 'co/user/UPDATE_USER';
export const INVALIDATE_USER = 'co/user/INVALIDATE_USER';
export const DELETE_USER = 'co/user/DELETE_USER';
export const DELETE_USER_FAIL = 'co/user/DELETE_USER_FAIL';

export function requestUser() {
  return {
    type: REQUEST_USER,
    payload: {
      request: {
        url: '/api/v1/me',
      },
    },
  };
}

export function invalidate() {
  return {
    type: INVALIDATE_USER,
    payload: {},
  };
}

export function updateUser({ user, original }) {
  const data = calcObjectForPatch(user, original);

  return {
    type: UPDATE_USER,
    payload: {
      request: {
        method: 'patch',
        url: `/api/v2/users/${user.user_id}`,
        data,
      },
    },
  };
}

export function deleteUser({ user, password }) {
  return {
    type: DELETE_USER,
    payload: {
      request: {
        method: 'post',
        url: `/api/v2/${user.user_id}/actions`,
        data: { password },
      },
    },
  };
}

export function updateUserContact(contact) {
  return (dispatch) => {
    dispatch(this.ContactsActions.updateContact(contact));
    dispatch(invalidate());
  };
}


const initialState = {
  isFetching: false,
  didInvalidate: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_USER:
    case REQUEST_USER:
      return { ...state, isFetching: true };
    case REQUEST_USER_SUCCESS:

      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        user: action.payload.data,
      };
    case INVALIDATE_USER:
      return { ...state, didInvalidate: true };
    case DELETE_USER_FAIL:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
