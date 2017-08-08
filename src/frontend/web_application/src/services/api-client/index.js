import axios from 'axios';
import config from '../config';

let client;
let headers = {
  'X-Caliopen-PI': '0;100',
  'X-Caliopen-IL': '0;100',
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
      baseURL: config.getAPIBaseUrl(),
      responseType: 'json',
      headers,
    });
  }

  return client;
}
