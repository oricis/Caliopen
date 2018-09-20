import { updateRemoteIdentity as updateRemoteIdentityBase, requestRemoteIdentity } from '../../../store/modules/remote-identity';
import { tryCatchAxiosAction } from '../../../services/api-client';
import { remoteIdentitySelector } from '../selectors/remoteIdentity';

export const updateRemoteIdentity = ({ remoteIdentity }) => async (dispatch, getState) => {
  const { identity_id: identityId } = remoteIdentity;
  const original = remoteIdentitySelector(getState(), { identityId });

  try {
    await tryCatchAxiosAction(() => dispatch(updateRemoteIdentityBase({
      remoteIdentity, original,
    })));

    const remoteIdentityUpToDate =
      await tryCatchAxiosAction(() => dispatch(requestRemoteIdentity({ identityId })));

    return remoteIdentityUpToDate;
  } catch (err) {
    return Promise.reject(err);
  }
};
