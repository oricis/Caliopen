import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { requestContacts } from '../../../../store/modules/contact';
import { withNotification } from '../../../../modules/userNotify';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  requestContacts,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withI18n(),
  withNotification(),
)(Presenter);
