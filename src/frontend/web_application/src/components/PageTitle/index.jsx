import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { userSelector } from '../../modules/user';
import Presenter from './presenter';

const mapStateToProps = createSelector(
  [userSelector],
  user => ({ user })
);

export default connect(mapStateToProps)(Presenter);
