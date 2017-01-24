import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import Presenter from './presenter';

const userSelector = state => state.user.user;
const mapStateToProps = createSelector(
  [userSelector],
  user => ({ user })
);

export default connect(mapStateToProps)(Presenter);
