export const REQUEST_PUBLIC_KEYS = 'co/public-key/REQUEST_PUBLIC_KEYS';
export const REQUEST_PUBLIC_KEYS_SUCCESS = 'co/public-key/REQUEST_PUBLIC_KEYS_SUCCESS';
export const REQUEST_PUBLIC_KEYS_FAIL = 'co/public-key/REQUEST_PUBLIC_KEYS_FAIL';
export const CREATE_PUBLIC_KEY = 'co/public-key/CREATE_PUBLIC_KEYS';
export const CREATE_PUBLIC_KEY_SUCCESS = 'co/public-key/CREATE_PUBLIC_KEYS_SUCCESS';
export const CREATE_PUBLIC_KEY_FAIL = 'co/public-key/CREATE_PUBLIC_KEYS_FAIL';
export const UPDATE_PUBLIC_KEY = 'co/public-key/UPDATE_PUBLIC_KEYS';
export const UPDATE_PUBLIC_KEY_SUCCESS = 'co/public-key/UPDATE_PUBLIC_KEYS_SUCCESS';
export const UPDATE_PUBLIC_KEY_FAIL = 'co/public-key/UPDATE_PUBLIC_KEYS_FAIL';
export const DELETE_PUBLIC_KEY = 'co/public-key/DELETE_PUBLIC_KEYS';
export const DELETE_PUBLIC_KEY_SUCCESS = 'co/public-key/DELETE_PUBLIC_KEYS_SUCCESS';
export const DELETE_PUBLIC_KEY_FAIL = 'co/public-key/DELETE_PUBLIC_KEYS_FAIL';

export function requestPublicKeys({ contactId }) {
  return {
    type: REQUEST_PUBLIC_KEYS,
    payload: {
      url: `api/v2/contacts/${contactId}/publickeys`,
    },
  };
}

export function createPublicKey({ contactId, params }) {
  return {
    type: CREATE_PUBLIC_KEY,
    payload: {
      request: {
        method: 'post',
        url: `/api/v2/contacts/${contactId}/publickeys`,
        data: params,
      },
    },
  };
}

export function updatePublicKey({ contactId, publickey, original }) {
  const { publicKeyId, label } = publickey;
  const data = { label, current_state: original };

  return {
    type: UPDATE_PUBLIC_KEY,
    payload: {
      request: {
        method: 'patch',
        url: `/api/v2/contacts/${contactId}/publickeys/${publicKeyId}`,
        data,
      },
    },
  };
}

export function deletePublicKey({ contactId, publicKeyId }) {
  return {
    type: DELETE_PUBLIC_KEY,
    payload: {
      request: {
        method: 'delete',
        url: `/api/v2/contacts/${contactId}/publickeys/${publicKeyId}`,
      },
    },
  };
}

export default function reducer(state = initialState, action) {
  
}
