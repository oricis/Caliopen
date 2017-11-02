import React, { PureComponent } from 'react';
import { createNotification, NOTIFICATION_TYPE_SUCCESS, NOTIFICATION_TYPE_INFO, NOTIFICATION_TYPE_WARNING, NOTIFICATION_TYPE_ERROR } from 'react-redux-notify';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withSettings } from './settings';

export {
  NOTIFICATION_TYPE_SUCCESS, NOTIFICATION_TYPE_INFO, NOTIFICATION_TYPE_WARNING,
  NOTIFICATION_TYPE_ERROR,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  createNotification,
}, dispatch);

const withNotification = () => (Component) => {
  class Notification extends PureComponent {
    static propTypes = {
      createNotification: PropTypes.func.isRequired,
      settings: PropTypes.shape({}).isRequired,
    };
    static defaultProps = {
    };

    handleNotify = ({
      message, duration, type = NOTIFICATION_TYPE_INFO, canDismiss = true, ...opts
    }) => {
      const {
        createNotification: notify,
        settings: {
          notification_enabled: notificationEnabled,
          notification_delay_disappear: notificationDelayDisappear,
        },
      } = this.props;

      if (notificationEnabled) {
        notify({
          ...opts,
          message,
          type,
          duration: (duration >= 0) ? duration : notificationDelayDisappear * 1000,
          canDismiss,
        });
      }
    }

    handleNotifySuccess = opts => this.handleNotify({ type: NOTIFICATION_TYPE_SUCCESS, ...opts });
    handleNotifyWarning = opts => this.handleNotify({ type: NOTIFICATION_TYPE_WARNING, ...opts });
    handleNotifyError = opts => this.handleNotify({ type: NOTIFICATION_TYPE_ERROR, ...opts });

    render() {
      const props = {
        notify: this.handleNotify,
        notifySuccess: this.handleNotifySuccess,
        notifyWarning: this.handleNotifyWarning,
        notifyError: this.handleNotifyError,
      };

      return (
        <Component {...props} {...this.props} />
      );
    }
  }

  return compose(
    withSettings(),
    connect(null, mapDispatchToProps)
  )(Notification);
};

export { withNotification };
