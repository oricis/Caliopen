import { withI18n } from 'lingui-react';
import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Presenter from './presenter';

const userSelector = state => state.user.user;
const mapStateToProps = createSelector(
  [userSelector],
  user => ({
    user,
  })
);

export default compose(
  withI18n(),
  connect(mapStateToProps),
)(Presenter);
