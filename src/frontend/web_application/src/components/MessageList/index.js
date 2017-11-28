import { compose } from 'redux';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import Presenter from './presenter';

const userSelector = state => state.user;

const mapStateToProps = createSelector(
  [userSelector],
  usertState => ({
    user: usertState.user,
  })
);

export default compose(
  connect(mapStateToProps),
  withTranslator()
)(Presenter);
