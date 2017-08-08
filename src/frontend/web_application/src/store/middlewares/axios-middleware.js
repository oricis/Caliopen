import axiosMiddleware from 'redux-axios-middleware';
import { createNotification, NOTIFICATION_TYPE_ERROR } from 'react-redux-notify';
import getClient from '../../services/api-client';
import { getTranslator } from '../../services/i18n';

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
    response: [{
      error: ({ getState, dispatch }, error) => {
        if (error.response.status === 401) {
          const { translate: __ } = getTranslator();
          const notification = {
            message: __('auth.feedback.deauth'),
            type: NOTIFICATION_TYPE_ERROR,
            duration: 0,
            canDismiss: true,
          };

          if (!getState().notifications.find(({ message }) => message === notification.message)) {
            dispatch(createNotification(notification));
          }
        }
      },
    }],
  },
});
