import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { removeDevice } from '../../../../store/modules/device';
import Presenter from './presenter';
import './style.scss';

const mapDispatchToProps = dispatch => bindActionCreators({
  onRevokeDevice: removeDevice,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator()
)(Presenter);
