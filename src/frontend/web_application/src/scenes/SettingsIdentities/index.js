import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { requestUser } from '../../store/modules/user';
import { updateContact } from '../../store/modules/contact';
import { withNotification } from '../../hoc/notification';
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

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  requestUser,
  updateContact,
  onRemoteIdentityChange: () => ownProps.notify({
    message: 'Connecting a remote identity is not yet available.',
  }),
}, dispatch);

export default compose(
  withNotification(),
  connect(mapStateToProps, mapDispatchToProps),
  withI18n(),
)(Presenter);
