import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { removeDevice } from '../../../../store/modules/device';
import Presenter from './presenter';
import './style.scss';

const mapDispatchToProps = dispatch => bindActionCreators({
  onRevokeDevice: removeDevice,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps)
)(Presenter);
