import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { requestSettings } from '../../store/modules/settings';

const mapDispatchToProps = dispatch => bindActionCreators({
  requestSettings,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
)(Presenter);
