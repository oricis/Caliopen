import { createRemoteIdentity as createRemoteIdentityBase, requestRemoteIdentity, addToCollection } from '../../../store/modules/remote-identity';
import { tryCatchAxiosAction } from '../../../services/api-client';

export const createRemoteIdentity = ({ remoteIdentity }) => async (dispatch) => {
  const { remote_id: remoteId } = await tryCatchAxiosAction(() =>
    dispatch(createRemoteIdentityBase({ remoteIdentity })));

  const remoteIdentityUpToDate = await tryCatchAxiosAction(() =>
    dispatch(requestRemoteIdentity({ remoteId })));

  await dispatch(addToCollection({ remoteIdentity: remoteIdentityUpToDate }));

  return remoteIdentityUpToDate;
};
