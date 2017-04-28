import axios from 'axios';
import config from '../config';

let client;
export default function getClient() {
  if (!client) {
    client = axios.create({
      baseURL: config.getAPIBaseUrl(),
      responseType: 'json',
      headers: {
        'X-Caliopen-PI': '0;100',
        'X-Caliopen-IL': '0;100',
      },
    });
  }

  return client;
}
