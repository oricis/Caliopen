import { CREATE_MESSAGE, UPDATE_MESSAGE } from '../modules/message';
import { encryptMessage as encryptMessageStart, encryptMessageSuccess, encryptMessageFail } from '../modules/encryption';
import { getKeysForEmail, PUBLIC_KEY } from '../../services/openpgp-keychain-repository';
import { getParticipantsKeys } from '../../modules/encryption';
import { getLocalIdentities, getRemoteIdentities } from '../../modules/identity';
import { encryptMessage } from '../../services/encryption';
import { getAuthor } from '../../services/message';

const getIdentities = () => async (getState, dispatch) => {
  const [localIdentities, remoteIdentities] =
    await Promise.all([getLocalIdentities()(dispatch, getState),
      getRemoteIdentities()(dispatch, getState)]);

  return [...localIdentities, ...remoteIdentities];
};

const getIdentitiesAddresses = identities => identities.map(({ identifier }) => identifier);

export const getAuthorAddresses = async (getState, dispatch, message) => {
  const author = getAuthor(message);
  const authorAddress = author && author.address;

  if (authorAddress) {
    return [authorAddress];
  }

  const { user_identities: userIdentitiesIds } = message;

  if (userIdentitiesIds && userIdentitiesIds.length > 0) {
    const userIdentities = (await getIdentities()(getState, dispatch))
      .filter(({ identity_id: identityId }) => userIdentitiesIds.includes(identityId));

    return getIdentitiesAddresses(userIdentities);
  }

  return [];
};

const extractMessageIdFromAction = (action) => {
  const messageId = action.payload.request.url.match(/messages\/(.*)$/)[1];

  return messageId;
};
const getFullDraftFromAction = (state, action) => {
  const { data: message, current_state: oldMessage } = action.payload.request;
  const { draftsByInternalId } = state.draftMessage;
  const participants = message.participants ||
    (oldMessage && oldMessage.participants);

  switch (action.type) {
    case CREATE_MESSAGE:
      return { participants, ...message };
    default:
      return {
        participants,
        ...Object.values(draftsByInternalId)
          .find(draft => draft.message_id === extractMessageIdFromAction(action)),
      };
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

    const authorAddresses = await getAuthorAddresses(store.getState, dispatch, message);

    if (authorAddresses.length === 0) return action;

    // 1. we need to check all addresses to find keys.
    const userKeys = await Promise.all(authorAddresses.map(authorAddress =>
      getKeysForEmail(authorAddress, PUBLIC_KEY)));

    if (keys && keys.length > 0 && userKeys.length > 0) {
      dispatch(encryptMessageStart({ message }));
      // 2. but there is no need for more than 1 key
      const encryptedMessage = await encryptMessage(message, [userKeys[0][0].armor(), ...keys]);

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
