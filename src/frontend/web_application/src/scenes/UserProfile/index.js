import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { requestUser } from '../../store/modules/user';
import { updateContact } from '../../store/modules/contact';
import Presenter from './presenter';

const userSelector = state => state.user;
const mapStateToProps = createSelector(
  [userSelector],
  userState => ({
    user: userState.user,
    isFetching: userState.isFetching,
  })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestUser,
  updateContact,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
