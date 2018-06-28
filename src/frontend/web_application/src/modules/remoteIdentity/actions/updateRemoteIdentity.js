import { updateRemoteIdentity as updateRemoteIdentityBase, requestRemoteIdentity } from '../../../store/modules/remote-identity';
import { tryCatchAxiosAction } from '../../../services/api-client';
import { remoteIdentitySelector } from '../selectors/remoteIdentity';

export const updateRemoteIdentity = ({ remoteIdentity }) => async (dispatch, getState) => {
  const { remote_id: remoteId } = remoteIdentity;
  const original = remoteIdentitySelector(getState(), { remoteId });

  try {
    await tryCatchAxiosAction(() => dispatch(updateRemoteIdentityBase({
      remoteIdentity, original,
    })));

    const remoteIdentityUpToDate =
      await tryCatchAxiosAction(() => dispatch(requestRemoteIdentity({ remoteId })));

    return remoteIdentityUpToDate;
  } catch (err) {
    return Promise.reject(err);
  }
};
