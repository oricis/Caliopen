import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from '@lingui/react';
import { withUser } from '../../../../hoc/user';
import { updateAll } from '../../../../store/modules/notification';
import { messageNotificationsSelector } from '../../../../store/selectors/notification';
import Presenter from './presenter';

const mapStateToProps = state => ({
  notifications: messageNotificationsSelector(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateNotifications: updateAll,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withI18n(),
  withUser()
)(Presenter);
