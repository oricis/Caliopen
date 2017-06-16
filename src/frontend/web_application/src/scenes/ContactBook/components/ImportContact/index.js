import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { createNotification, NOTIFICATION_TYPE_SUCCESS, NOTIFICATION_TYPE_ERROR } from 'react-redux-notify';
import { requestContacts } from '../../../../store/modules/contact';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  notifySuccess: message => createNotification({
    message,
    type: NOTIFICATION_TYPE_SUCCESS,
  }),
  notifyError: message => createNotification({
    message,
    type: NOTIFICATION_TYPE_ERROR,
  }),
  requestContacts,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator()
)(Presenter);
