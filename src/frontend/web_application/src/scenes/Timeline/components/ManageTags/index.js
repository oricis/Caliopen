import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { updateMessage } from '../../../../store/modules/message';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  onMessageChange: updateMessage,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
)(Presenter);
