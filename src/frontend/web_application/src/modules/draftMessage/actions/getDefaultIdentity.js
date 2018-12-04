import { getLocalIdentities, getRemoteIdentities } from '../../identity';

const isRecipient = ({ participants, identity }) => participants
  .some(participant => participant.type === 'To' &&
    participant.address === identity.identifier &&
    participant.protocol === identity.protocol);

const isIdentityUsed = ({ participants, identity }) => participants
  .some(participant => participant.address === identity.identifier &&
    participant.protocol === identity.protocol);

export const getDefaultIdentity = ({ parentMessage } = {}) => async (dispatch) => {
  const [localIdentity] = await dispatch(getLocalIdentities());

  if (!parentMessage) {
    return localIdentity;
  }

  const { participants } = parentMessage;

  if (isRecipient({ identity: localIdentity, participants })) {
    return localIdentity;
  }

  const remoteIdentities = await dispatch(getRemoteIdentities());

  const remoteIdentity = remoteIdentities.reduce((acc, curr) => {
    if (acc && isRecipient({ identity: acc, participants })) {
      return acc;
    }

    if (isIdentityUsed({ identity: curr, participants })) {
      return curr;
    }

    if (
      (!acc || !isIdentityUsed({ identity: acc, participants })) &&
      parentMessage.participants.some(participant => participant.protocol === curr.protocol)
    ) {
      return curr;
    }

    return acc;
  }, undefined);

  if (remoteIdentity) {
    return remoteIdentity;
  }

  return localIdentity;
};
