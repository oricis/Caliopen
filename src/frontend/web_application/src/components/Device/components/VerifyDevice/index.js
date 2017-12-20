import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { verifyDevice, removeDevice } from '../../../../store/modules/device';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  onVerifyDevice: verifyDevice,
  onDeleteDevice: removeDevice,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withI18n()
)(Presenter);
