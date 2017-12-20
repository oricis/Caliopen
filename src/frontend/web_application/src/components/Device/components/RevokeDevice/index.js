import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { removeDevice } from '../../../../store/modules/device';
import Presenter from './presenter';
import './style.scss';

const mapDispatchToProps = dispatch => bindActionCreators({
  onRevokeDevice: removeDevice,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withI18n()
)(Presenter);
