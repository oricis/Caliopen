import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { createNotification, NOTIFICATION_TYPE_INFO } from 'react-redux-notify';
import { requestUser } from '../../store/modules/user';
import { updateContact } from '../../store/modules/contact';
import Presenter from './presenter';

const userSelector = state => state.user;

// const remoteIdentitiesSelector = createSelector(
//   state => state.remoteIdentity,
//   remoteIdentityState => ({
//     remoteIdentities: remoteIdentityState
//       .remoteIdentities.map(id => remoteIdentityState.remoteIdentitiesById[id]),
//   })
// );

const mapStateToProps = createSelector(
  [userSelector],
  userState => ({
    user: userState.user,
    isFetching: userState.isFetching,
  })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestUser,
  updateContact,
  onRemoteIdentityChange: () => createNotification({
    message: 'Connecting a remote identity is not yet available.',
    type: NOTIFICATION_TYPE_INFO,
    duration: 10000,
    canDismiss: true,
  }),
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
