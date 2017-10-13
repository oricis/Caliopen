import axios from 'axios';
import { getAPIBaseUrl } from '../config';
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
      baseURL: getAPIBaseUrl(),
      responseType: 'json',
      headers,
    });
  }

  return client;
}
