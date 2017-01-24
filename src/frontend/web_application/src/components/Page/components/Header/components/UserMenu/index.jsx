import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslator } from '@gandi/react-translate';
import Presenter from './presenter';

const userSelector = state => state.user.user;
const mapStateToProps = createSelector(
  [userSelector],
  user => ({ user })
);

export default compose(
  connect(mapStateToProps),
  withTranslator()
)(Presenter);
