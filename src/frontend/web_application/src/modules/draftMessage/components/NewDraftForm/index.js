import { withI18n } from 'lingui-react';
import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { userSelector } from '../../../../modules/user';
import Presenter from './presenter';

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
