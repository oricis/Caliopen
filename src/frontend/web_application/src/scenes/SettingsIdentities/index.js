import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { requestUser } from '../../store/modules/user';
import { updateContact } from '../../store/modules/contact';
import { createRemoteIdentity, deleteRemoteIdentity } from '../../modules/remoteIdentity';
import { requestRemoteIdentities, updateRemoteIdentity, getRemoteIdentity } from '../../store/modules/remote-identity';
import { withNotification } from '../../hoc/notification';
import Presenter from './presenter';

const userSelector = state => state.user;
const remoteIdentitiesStateSelector = state => state.remoteIdentity;
const remoteIdentitiesSelector = createSelector(
  [remoteIdentitiesStateSelector],
  remoteIdentityState => remoteIdentityState.remoteIdentities
    .map(remoteId => remoteIdentityState.remoteIdentitiesById[remoteId])
);
const remoteIdentitySelector = createSelector(
  [remoteIdentitiesStateSelector, (state, { remoteId }) => remoteId],
  (remoteIdentityState, remoteId) =>
    remoteIdentityState.remoteIdentitiesById[remoteId]
);

const mapStateToProps = createSelector(
  [userSelector, remoteIdentitiesStateSelector, remoteIdentitiesSelector],
  (userState, remoteIdentityState, remoteIdentities) => ({
    user: userState.user,
    isFetching: userState.isFetching || remoteIdentityState.isFetching,
    remoteIdentities: [...remoteIdentities]
      .sort((a, b) => a.display_name.localeCompare(b.display_name)),
  })
);

const onRemoteIdentityChange = ({ remoteIdentity }) => async (dispatch, getState) => {
  if (!remoteIdentity.remote_id) {
    return dispatch(createRemoteIdentity({ remoteIdentity }));
  }

  const original = remoteIdentitySelector(getState(), { remoteId: remoteIdentity.remote_id });
  await dispatch(updateRemoteIdentity({ remoteIdentity, original }));

  return dispatch(getRemoteIdentity({ remoteIdentity }));
};

const mapDispatchToProps = dispatch => bindActionCreators({
  requestUser,
  updateContact,
  requestRemoteIdentities,
  onRemoteIdentityChange,
  onRemoteIdentityDelete: deleteRemoteIdentity,
}, dispatch);

export default compose(
  withNotification(),
  connect(mapStateToProps, mapDispatchToProps),
)(Presenter);
