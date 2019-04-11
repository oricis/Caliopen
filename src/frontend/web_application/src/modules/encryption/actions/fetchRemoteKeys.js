import { requestPublicKeys } from '../../../store/modules/public-key';
import { tryCatchAxiosAction } from '../../../services/api-client';

export default async function fetchRemoteKeys(dispatch, contactIds) {
  return Promise.all(
    contactIds
      .map(contactId => tryCatchAxiosAction(() => dispatch(requestPublicKeys({ contactId }))))
  );
}
