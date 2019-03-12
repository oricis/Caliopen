// Renaming REQUEST_DRAFT_SUCCESS actions for disambiguation.
import { decryptDraftSuccess, REQUEST_DRAFT_SUCCESS as DRAFT_REQUEST_DRAFT_SUCCESS } from '../modules/draft-message';
import { FETCH_MESSAGES_SUCCESS, REQUEST_MESSAGE_SUCCESS, REQUEST_MESSAGES_SUCCESS, REQUEST_DRAFT_SUCCESS as MESSAGE_REQUEST_DRAFT_SUCCESS } from '../modules/message';
import { askPassphrase, needPassphrase, setPassphraseSuccess, resetPassphrase, needPrivateKey, decryptMessage as decryptMessageStart, decryptMessageSuccess, decryptMessageFail, SET_PASSPHRASE, SET_PASSPHRASE_SUCCESS } from '../modules/encryption';
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

// XXX refactor this ASAP
const decryptMessageAction = async (state, dispatch, message) => {
  if (!isMessageEncrypted(message)) {
    return message;
  }

  try {
    dispatch(decryptMessageStart({ message }));
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
        try {
          await usableKey.decrypt(passphrase);
        } catch (e) {
          dispatch(askPassphrase({
            fingerprint: usableKey.getFingerprint(),
            error: e.message,
          }));

          return message;
        }
      }
    }

    if (!usableKey) {
      keys.forEach(key => dispatch(askPassphrase({ fingerprint: key.getFingerprint() })));
      dispatch(needPassphrase({ message, fingerprints: keys.map(key => key.getFingerprint()) }));

      return message;
    }

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
    .filter(messageEntry => messageEntry.keyFingerprint &&
      Object.values(messageEntry.keyFingerprint).includes(fingerprint));
};

const setPassphraseAction = (state, dispatch, action) => {
  const { fingerprint } = action.payload;
  const messages = findMessagesEncryptedWithKey(state, fingerprint)
    .map(message => message.encryptedMessage);

  decryptMessagesAction(state, dispatch, messages);
  // discard passphrase after 20 minutes
  setTimeout(() => dispatch(resetPassphrase({ fingerprint })), 12000000);
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
      next(action);

      return store.dispatch(setPassphraseSuccess({ fingerprint: action.payload.fingerprint }));
    case SET_PASSPHRASE_SUCCESS:
      setPassphraseAction(store.getState(), store.dispatch, action);

      return next(action);
    default:
      break;
  }

  return next(action);
};
