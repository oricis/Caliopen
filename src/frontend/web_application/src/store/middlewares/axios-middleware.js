import axiosMiddleware from 'redux-axios-middleware';
import getClient from '../../services/api-client';

export default axiosMiddleware(getClient(), {
  interceptors: {
    request: [({ getState }, config) => {
      const [min, max] = getState().importanceLevel.range;

      return {
        ...config,
        headers: {
          ...config.headers,
          'X-Caliopen-IL': `${min};${max}`,
        },
      };
    }],
  },
});
