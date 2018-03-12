import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { revokeDevice, withDevice } from '../../../../modules/device';
import { withNotification } from '../../../../hoc/notification';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  revokeDevice,
  push,
}, dispatch);

export default compose(
  withDevice(),
  connect(null, mapDispatchToProps),
  withNotification()
)(Presenter);
