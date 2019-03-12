import { CREATE_MESSAGE, UPDATE_MESSAGE } from '../modules/message';
import { encryptMessage as encryptMessageStart, encryptMessageSuccess, encryptMessageFail } from '../modules/encryption';
import { requestRemoteIdentity } from '../modules/remote-identity';
import { tryCatchAxiosAction } from '../../services/api-client';
import { getKeysForEmail, PUBLIC_KEY } from '../../services/openpgp-keychain-repository';
import { getParticipantsKeys } from '../../modules/encryption';
import { identitiesSelector } from '../selectors/identities';
import { encryptMessage } from '../../services/encryption';
import { getAuthor } from '../../services/message';

const getIdentities = (state, identitiesIds) =>
  identitiesSelector(state).filter(identity => identitiesIds.includes(identity.identity_id));

const fetchRemoteIdentities = async (dispatch, identitiesIds) =>
  Promise.all(identitiesIds.map(identityId =>
    tryCatchAxiosAction(dispatch(requestRemoteIdentity({ identityId })))));

const getIdentitiesAddresses = identities => identities.map(({ identifier }) => identifier);

export const getAuthorAddress = async (state, dispatch, message) => {
  const author = getAuthor(message);
  const authorAddress = author && author.address;

  if (authorAddress) {
    return authorAddress;
  }

  const { user_identities: userIdentitiesIds } = message;

  if (userIdentitiesIds && userIdentitiesIds.length > 0) {
    const userIdentities = getIdentities(state, userIdentitiesIds)
      || await fetchRemoteIdentities(dispatch, userIdentitiesIds);

    return getIdentitiesAddresses(userIdentities)[0];
  }

  return null;
};

const extractMessageIdFromAction = (action) => {
  const messageId = action.payload.request.url.match(/messages\/(.*)$/)[1];

  return messageId;
};
const getFullDraftFromAction = (state, action) => {
  const { data: message } = action.payload.request;
  const { draftsByInternalId } = state.draftMessage;

  switch (action.type) {
    case CREATE_MESSAGE:
      return message;
    default:
      return Object.values(draftsByInternalId)
        .find(draft => draft.message_id === extractMessageIdFromAction(action));
  }
};

const rebuildAction = (action, message, encryptedMessage) => ({
  ...action,
  payload: {
    ...action.payload,
    request: {
      ...action.payload.request,
      data: {
        ...action.payload.request.data,
        current_state: action.payload.request.data.current_state ? {
          ...action.payload.request.data.current_state,
          body: action.payload.request.data.current_state.body || message.body,
          privacy_features: action.payload.request.data.current_state.privacy_features
          || message.privacy_features,
        } : undefined,
        body: encryptedMessage.body,
        privacy_features: encryptedMessage.privacy_features,
      },
    },
  },
});

const encryptMessageAction = async (store, dispatch, action) => {
  const message = getFullDraftFromAction(store.getState(), action);

  // XXX : needed until we support MIME multipart messages.
  if (message.attachments) {
    return rebuildAction(action, message, {
      ...message,
      body: action.payload.request.data.body,
      privacy_features: {},
    });
  }

  try {
    const keys = await getParticipantsKeys(store.getState(), store.dispatch, message);

    const authorAddress = await getAuthorAddress(store.getState(), dispatch, message);

    if (!authorAddress) return action;

    const userKeys = await getKeysForEmail(authorAddress, PUBLIC_KEY);

    if (keys && keys.length > 0 && userKeys.length > 0) {
      dispatch(encryptMessageStart({ message }));
      // userKeys[0] : no need more than 1 key
      const encryptedMessage = await encryptMessage(message, [userKeys[0].armor(), ...keys]);

      dispatch(encryptMessageSuccess({ message, encryptedMessage }));

      return rebuildAction(action, message, encryptedMessage);
    }
  } catch (error) {
    dispatch(encryptMessageFail({ message, error }));
  }

  return action;
};

export default store => next => async (action) => {
  switch (action.type) {
    case CREATE_MESSAGE:
    case UPDATE_MESSAGE:
      return next(await encryptMessageAction(store, store.dispatch, action));
    default:
      break;
  }

  return next(action);
};
