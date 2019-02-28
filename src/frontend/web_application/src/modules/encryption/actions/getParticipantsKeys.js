import { getParticipantsAddresses, getParticipantsContactIds, getRecipients } from '../../../services/message';
import { requestParticipantsForDiscussionId } from '../../../modules/discussion';
import { filterKeysByAddress, checkEachAddressHasKey, getStoredKeys } from '../services/keyring/remoteKeys';
import fetchRemoteKeys from '../actions/fetchRemoteKeys';

export const getParticipantsKeys = async (state, dispatch,
  { participants, discussion_id: discussionId }) => {
  const actualParticipants = getRecipients({ participants }) ||
      getRecipients({
        participants:
          await requestParticipantsForDiscussionId({ discussionId })(dispatch, () => state),
      });

  const allContactIds = getParticipantsContactIds({ participants: actualParticipants });
  const allAddresses = getParticipantsAddresses({ participants: actualParticipants });

  const { keys: cachedKeys, missingKeysContactIds } = getStoredKeys(state, allContactIds);
  const fetchedKeys = await fetchRemoteKeys(dispatch, missingKeysContactIds);

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

