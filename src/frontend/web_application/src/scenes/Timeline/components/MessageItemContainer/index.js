import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { replyToMessage } from '../../../../store/modules/message';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  replyToMessage,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator()
)(Presenter);
