import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRemoteIdentity, deleteRemoteIdentity, updateRemoteIdentity, remoteIdentitiesSelector, remoteIdentitiesStateSelector } from '../../modules/remoteIdentity';
import { requestRemoteIdentities } from '../../store/modules/remote-identity';
import { notifyError } from '../../modules/userNotify';
import Presenter from './presenter';

const mapStateToProps = createSelector(
  [remoteIdentitiesStateSelector, remoteIdentitiesSelector],
  (remoteIdentityState, remoteIdentities) => ({
    isFetching: remoteIdentityState.isFetching,
    remoteIdentities: [...remoteIdentities]
      .sort((a, b) => a.display_name.localeCompare(b.display_name)),
  })
);

const onRemoteIdentityChange = ({ remoteIdentity }) => (dispatch) => {
  try {
    if (!remoteIdentity.remote_id) {
      return dispatch(createRemoteIdentity({ remoteIdentity }));
    }

    return dispatch(updateRemoteIdentity({ remoteIdentity }));
  } catch (err) {
    // FIXME
    return dispatch(notifyError({ message: err }));
  }
};

const mapDispatchToProps = dispatch => bindActionCreators({
  requestRemoteIdentities,
  onRemoteIdentityChange,
  onRemoteIdentityDelete: deleteRemoteIdentity,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
