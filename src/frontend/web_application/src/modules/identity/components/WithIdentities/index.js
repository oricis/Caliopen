import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { getLocalIdentities } from '../../actions/getLocalIdentities';
import { getRemoteIdentities } from '../../actions/getRemoteIdentities';

const remoteIdentitystateSelector = state => state.remoteIdentity;
const localIdentityStateSelector = state => state.localIdentity;

const mapStateToProps = createSelector(
  [remoteIdentitystateSelector, localIdentityStateSelector],
  ({
    remoteIdentities,
    remoteIdentitiesById,
    remoteIsFetching,
  }, {
    localIdentities,
    localIsFetching,
  }) => ({
    remoteIdentities: remoteIdentities.map(identityId => remoteIdentitiesById[identityId]),
    remoteIsFetching,
    localIdentities,
    localIsFetching,
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  getLocalIdentities,
  getRemoteIdentities,
}, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(Presenter);
