import axiosMiddleware from 'redux-axios-middleware';
import getClient from '../../services/api-client';

export default axiosMiddleware(getClient());
