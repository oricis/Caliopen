// Renaming REQUEST_DRAFT_SUCCESS actions for disambiguation.
import { decryptDraftSuccess, REQUEST_DRAFT_SUCCESS as DRAFT_REQUEST_DRAFT_SUCCESS } from '../modules/draft-message';
import { FETCH_MESSAGES_SUCCESS, REQUEST_MESSAGE_SUCCESS, REQUEST_MESSAGES_SUCCESS, REQUEST_DRAFT_SUCCESS as MESSAGE_REQUEST_DRAFT_SUCCESS } from '../modules/message';
import { askPassphrase, needPassphrase, needPrivateKey, decryptMessage as decryptMessageStart, decryptMessageSuccess, decryptMessageFail, SET_PASSPHRASE } from '../modules/encryption';
import { getKeysForMessage } from '../../services/openpgp-keychain-repository';
import { isMessageEncrypted, decryptMessage } from '../../services/encryption';

const extractMessagesFromAction = ({ payload, type }) => {
  switch (type) {
    case DRAFT_REQUEST_DRAFT_SUCCESS:
      return [payload.draft];
    case REQUEST_MESSAGE_SUCCESS:
      return [payload.data];
    case REQUEST_MESSAGES_SUCCESS:
    case FETCH_MESSAGES_SUCCESS:
    case MESSAGE_REQUEST_DRAFT_SUCCESS:
      return payload.data.messages;
    default:
      return [];
  }
};

const getKeyPassphrase = (state, fingerprint) => {
  const { privateKeysByFingerprint } = state.encryption;

  return privateKeysByFingerprint[fingerprint] &&
    privateKeysByFingerprint[fingerprint].status === 'ok' &&
    privateKeysByFingerprint[fingerprint].passphrase;
};

const decryptMessageAction = async (state, dispatch, message) => {
  if (!isMessageEncrypted(message)) {
    return message;
  }

  try {
    const keys = await getKeysForMessage(message);

    if (keys.length <= 0) {
      dispatch(needPrivateKey({ message }));

      return message;
    }

    let usableKey = keys.find(key => key.isDecrypted());
    let passphrase = null;

    if (!usableKey) {
      usableKey = keys.find(key => getKeyPassphrase(state, key.getFingerprint()));

      if (usableKey) {
        passphrase = getKeyPassphrase(state, usableKey.getFingerprint());
        await usableKey.decrypt(passphrase);
      }
    }

    if (!usableKey) {
      keys.forEach(key => dispatch(askPassphrase({ fingerprint: key.getFingerprint() })));
      dispatch(needPassphrase({ message, fingerprints: keys.map(key => key.getFingerprint()) }));

      return message;
    }

    dispatch(decryptMessageStart({ message }));
    const decryptedMessage = await decryptMessage(message, [usableKey]);
    dispatch(decryptMessageSuccess({ message, decryptedMessage }));

    return decryptedMessage;
  } catch (e) {
    const { message: error } = e;
    dispatch(decryptMessageFail({ message, error }));

    return message;
  }
};

const decryptMessagesAction = async (state, dispatch, messages) => {
  if (messages.length <= 0) return messages;

  return Promise.all(messages.map(message => decryptMessageAction(state, dispatch, message)));
};

const findMessagesEncryptedWithKey = (state, fingerprint) => {
  const { messageEncryptionStatusById } = state.encryption;

  return Object.values(messageEncryptionStatusById)
    .filter(messageEntry => fingerprint === messageEntry.keyFingerprint);
};

const setPassphraseAction = (state, dispatch, action) => {
  const messages = findMessagesEncryptedWithKey(state, action.payload.fingerprint);

  decryptMessagesAction(state, dispatch, messages);
};

export default store => next => async (action) => {
  switch (action.type) {
    case DRAFT_REQUEST_DRAFT_SUCCESS:
      decryptMessageAction(store.getState(), store.dispatch, extractMessagesFromAction(action)[0])
        .then(draft =>
          store.dispatch(decryptDraftSuccess({ internalId: action.payload.internalId, draft })));

      return next(action);
    case MESSAGE_REQUEST_DRAFT_SUCCESS:
    case REQUEST_MESSAGE_SUCCESS:
    case REQUEST_MESSAGES_SUCCESS:
    case FETCH_MESSAGES_SUCCESS:
      decryptMessagesAction(store.getState(), store.dispatch, extractMessagesFromAction(action));

      return next(action);
    case SET_PASSPHRASE:
      store.dispatch(action);
      setPassphraseAction(store.getState(), store.dispatch, action);
      // decrypt message
      // init setTimeout to reset key
      // forward passphrase to redux.
      break;
    default:
      break;
  }

  return next(action);
};
