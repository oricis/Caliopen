import axios from 'axios';
import { getBaseUrl } from '../config';
import { importanceLevelHeader } from '../importance-level';

let client;
let headers = {
  ...importanceLevelHeader,
  'X-Caliopen-PI': '0;100',
};

if (BUILD_TARGET !== 'server') {
  headers = {
    ...headers,
    'X-Requested-With': 'XMLHttpRequest',
  };
}

if (BUILD_TARGET === 'server') {
  // eslint-disable-next-line global-require
  const { getSubRequestHeaders } = require('../../../server/api/lib/sub-request-manager');
  headers = {
    ...headers,
    ...getSubRequestHeaders(),
  };
}

export default function getClient() {
  if (!client) {
    client = axios.create({
      baseURL: getBaseUrl(),
      responseType: 'json',
      headers,
    });
  }

  return client;
}


export const handleClientResponseSuccess = (response) => {
  if (!response || !response.payload) {
    throw new Error('Not an axios success Promise');
  }

  return Promise.resolve(response.payload.data);
};

export const handleClientResponseError = (payload) => {
  if (!payload || !payload.error || !payload.error.response) {
    throw new Error('Not an axios catched Promise', payload);
  }

  return Promise.reject(payload.error.response.data.errors);
};

export const tryCatchAxiosAction = async (action) => {
  try {
    const response = await action();

    return handleClientResponseSuccess(response);
  } catch (err) {
    return handleClientResponseError(err);
  }
};
