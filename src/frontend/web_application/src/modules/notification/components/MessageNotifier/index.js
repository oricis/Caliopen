import { compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from '@lingui/react';
import { withRouter } from 'react-router-dom';
import { withSettings } from '../../../settings';
import { withNotification } from '../../../userNotify';
import { messageNotificationsSelector } from '../../../../store/selectors/notification';
import Presenter from './presenter';

const mapStateToProps = state => ({
  notifications: messageNotificationsSelector(state),
});

export default compose(
  connect(mapStateToProps),
  withI18n(),
  withNotification(),
  withSettings(),
  withRouter,
)(Presenter);
