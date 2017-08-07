import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { createNotification, NOTIFICATION_TYPE_ERROR } from 'react-redux-notify';
import { requestContact, updateContact } from '../../store/modules/contact';
import Presenter from './presenter';

const contactIdSelector = (state, ownProps) => ownProps.match.params.contactId;
const contactSelector = state => state.contact;

const mapStateToProps = createSelector(
  [contactIdSelector, contactSelector],
  (contactId, contactState) => ({
    contactId,
    contact: contactState.contactsById[contactId],
    isFetching: contactState.isFetching,
  })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestContact,
  updateContact,
  notifyError: message => createNotification({
    message,
    type: NOTIFICATION_TYPE_ERROR,
  }),
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
