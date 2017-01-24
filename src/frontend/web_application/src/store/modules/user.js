export const REQUEST_USER = 'co/application/REQUEST_USER';
export const REQUEST_USER_SUCCESS = 'co/application/REQUEST_USER_SUCCESS';
export const REQUEST_USER_FAIL = 'co/application/REQUEST_USER_FAIL';
export const INVALIDATE_USER = 'co/application/INVALIDATE_USER';

export function requestUser() {
  return {
    type: REQUEST_USER,
    payload: {
      request: {
        url: '/v1/me',
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
    default:
      return state;
  }
}
