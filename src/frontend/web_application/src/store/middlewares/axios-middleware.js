import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import config from '../../services/config';

const client = axios.create({
  baseURL: config.getAPIBaseUrl(),
  responseType: 'json',
});

export default axiosMiddleware(client);
