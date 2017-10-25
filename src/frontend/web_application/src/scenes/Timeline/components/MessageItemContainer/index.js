import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { replyToMessage, deleteMessage } from '../../../../store/modules/message';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  replyToMessage,
  deleteMessage,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator()
)(Presenter);
