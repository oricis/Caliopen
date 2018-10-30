import getClient from '../../../services/api-client';

export const getProvider = ({ providerName }) => getClient()
  .get(`/api/v2/providers/${providerName}`)
  .then(payload => payload.data);
