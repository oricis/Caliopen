export const GENERATE = 'co/openpgp-keychain/GENERATE';
export const GENERATION_SUCCEED = 'co/openpgp-keychain/GENERATION_SUCCEED';
export const IMPORT_PUBLIC_KEY = 'co/openpgp-keychain/IMPORT_PUBLIC_KEY';
export const IMPORT_KEY_PAIR = 'co/openpgp-keychain/IMPORT_KEY_PAIR';
export const IMPORT_SUCCEED = 'co/openpgp-keychain/IMPORT_SUCCEED';
export const IMPORT_FAILED = 'co/openpgp-keychain/IMPORT_FAILED';
export const IMPORT_CANCEL = 'co/openpgp-keychain/IMPORT_CANCEL';
export const SAVE = 'co/openpgp-keychain/SAVE';
export const FETCH_ALL = 'co/openpgp-keychain/FETCH_ALL';
export const RECEIVE_ALL = 'co/openpgp-keychain/RECEIVE_ALL';
export const DELETE = 'co/openpgp-keychain/DELETE';

export function generate(name, email, passphrase) {
  return {
    type: GENERATE,
    payload: {
      name,
      email,
      passphrase,
    },
  };
}

export function generationSucceed(fingerprint, publicKeyArmored, privateKeyArmored) {
  return {
    type: GENERATION_SUCCEED,
    payload: {
      fingerprint,
      publicKeyArmored,
      privateKeyArmored,
    },
  };
}

export function importPublicKeyChain(publicKeyArmored) {
  return {
    type: IMPORT_PUBLIC_KEY,
    payload: { publicKeyArmored },
  };
}

export function importKeyPairChains(publicKeyArmored, privateKeyArmored) {
  return {
    type: IMPORT_KEY_PAIR,
    payload: { publicKeyArmored, privateKeyArmored },
  };
}

export function importKeyChainSucceed(fingerprint, publicKeyArmored, privateKeyArmored) {
  return {
    type: IMPORT_SUCCEED,
    payload: { fingerprint, publicKeyArmored, privateKeyArmored },
  };
}

export function importKeyChainFailed(errors) {
  return {
    type: IMPORT_FAILED,
    payload: { errors },
  };
}

export function importKeyChainCancel() {
  return {
    type: IMPORT_CANCEL,
    payload: {},
  };
}

export function save(fingerprint, publicKeyArmored, privateKeyArmored) {
  return {
    type: SAVE,
    payload: {
      fingerprint,
      publicKeyArmored,
      privateKeyArmored,
    },
  };
}

export function fetchAll() {
  return {
    type: FETCH_ALL,
    payload: {},
  };
}

export function receiveAll(keychainByFingerprint) {
  return {
    type: RECEIVE_ALL,
    payload: {
      keychainByFingerprint,
    },
  };
}

export function deleteKey(fingerprint) {
  return {
    type: DELETE,
    payload: {
      fingerprint,
    },
  };
}

const initialState = {
  isLoading: false,
  keychainByFingerprint: {},
  privateKeys: [],
  importForm: {},
};

const initialImportFormState = {
  errors: {},
};

function importFormReducer(state = initialImportFormState, action) {
  switch (action.type) {
    case IMPORT_PUBLIC_KEY:
      return {
        ...initialImportFormState,
        publicKeyArmored: action.payload.publicKeyArmored,
      };
    case IMPORT_KEY_PAIR:
      return {
        ...initialImportFormState,
        publicKeyArmored: action.payload.publicKeyArmored,
        privateKeyArmored: action.payload.privateKeyArmored,
      };
    case IMPORT_FAILED:
      return { ...state, errors: action.payload.errors };
    case IMPORT_SUCCEED:
    case IMPORT_CANCEL:
      return initialImportFormState;
    default:
      return state;
  }
}

function privateKeysReducer(state = [], action) {
  if (action.type !== RECEIVE_ALL) {
    return state;
  }

  return Object.keys(action.payload.keychainByFingerprint)
    .filter(fingerprint => !!action.payload.keychainByFingerprint[fingerprint].privateKeyArmored);
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GENERATE:
      return { ...state, isLoading: true };
    case GENERATION_SUCCEED:
      return { ...state, isLoading: false };
    case IMPORT_KEY_PAIR:
    case IMPORT_PUBLIC_KEY:
    case IMPORT_FAILED:
    case IMPORT_SUCCEED:
    case IMPORT_CANCEL:
      return { ...state, importForm: importFormReducer(state.importForm, action) };
    case RECEIVE_ALL:
      return {
        ...state,
        keychainByFingerprint: action.payload.keychainByFingerprint,
        privateKeys: privateKeysReducer(state.privateKeys, action),
      };
    default:
      return state;
  }
}
