import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withCurrentTab } from '../../hoc/tab';
import { userSelector } from '../../modules/user';
import Presenter from './presenter';

const mapStateToProps = createSelector(
  [userSelector],
  user => ({ user })
);

export default compose(
  connect(mapStateToProps),
  withCurrentTab()
)(Presenter);
