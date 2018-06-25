import { deleteRemoteIdentity as deleteRemoteIdentityBase, removeFromCollection } from '../../../store/modules/remote-identity';
import { tryCatchAxiosAction } from '../../../services/api-client';

export const deleteRemoteIdentity = ({ remoteIdentity }) => async (dispatch) => {
  await tryCatchAxiosAction(() => dispatch(deleteRemoteIdentityBase({ remoteIdentity })));

  return dispatch(removeFromCollection({ remoteIdentity }));
};
