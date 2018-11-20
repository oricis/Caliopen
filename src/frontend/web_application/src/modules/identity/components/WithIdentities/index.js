import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { requestLocalIdentities } from '../../../../store/modules/local-identity';
import { requestRemoteIdentities } from '../../../../store/modules/remote-identity';

const remoteIdentitystateSelector = state => state.remoteIdentity;
const localIdentityStateSelector = state => state.localIdentity;

const mapStateToProps = createSelector(
  [remoteIdentitystateSelector, localIdentityStateSelector],
  ({
    remoteIdentities,
    remoteIdentitiesById,
    remoteIsFetching,
    remotedidInvalidated,
  }, {
    localIdentities,
    localIsFetching,
    localdidInvalidated,
  }) => ({
    remoteIdentities: remoteIdentities.map(identityId => remoteIdentitiesById[identityId]),
    remoteIsFetching,
    remotedidInvalidated,
    localIdentities,
    localIsFetching,
    localdidInvalidated,
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestLocalIdentities,
  requestRemoteIdentities,
}, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(Presenter);
