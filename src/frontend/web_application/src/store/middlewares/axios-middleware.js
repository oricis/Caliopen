import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import config from '../../services/config';

const client = axios.create({
  baseURL: config.getAPIBaseUrl(),
  responseType: 'json',
  headers: {
    'X-Caliopen-PI': '0;100',
    'X-Caliopen-IL': '0;100',
  },
});

export default axiosMiddleware(client);
