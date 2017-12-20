import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { requestUser } from '../../store/modules/user';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({ requestUser }, dispatch);

export default compose(
  connect(undefined, mapDispatchToProps),
  withI18n()
)(Presenter);
