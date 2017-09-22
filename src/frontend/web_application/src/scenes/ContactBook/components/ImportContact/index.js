import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { requestContacts } from '../../../../store/modules/contact';
import { withNotification } from '../../../../services/notification';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  requestContacts,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator(),
  withNotification(),
)(Presenter);
