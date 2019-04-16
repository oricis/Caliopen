import { getParticipantsAddresses, getParticipantsContactIds } from '../../../services/message';
import { filterKeysByAddress, checkEachAddressHasKey, getStoredKeys } from '../services/keyring/remoteKeys';
import { fetchRemoteKeys } from './fetchRemoteKeys';

export const getParticipantsKeys = ({ message }) => async (dispatch, getState) => {
  const { participants } = message;
  const allContactIds = getParticipantsContactIds({ participants });
  const allAddresses = getParticipantsAddresses({ participants });

  const { keys: cachedKeys, missingKeysContactIds } = getStoredKeys(getState(), allContactIds);
  const fetchedKeys = (await dispatch(fetchRemoteKeys(missingKeysContactIds))) || [];

  // filter out unnecessary public keys.
  const filteredKeys = filterKeysByAddress(
    [...cachedKeys,
      ...(fetchedKeys.reduce((acc, key) => [...acc, ...key.pubkeys], []))],
    allAddresses
  );

  // Check if we have all needed public keys.
  if (!checkEachAddressHasKey(allAddresses, filteredKeys)) {
    throw new Error('Some public keys are missing.');
  }

  return filteredKeys;
};
