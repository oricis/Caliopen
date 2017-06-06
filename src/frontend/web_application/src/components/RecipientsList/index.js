import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import Presenter from './presenter';
import { requestContacts } from '../../store/modules/contact';

const contactsSelector = createSelector(
  state => state.contact,
  payload => payload.contacts.map(contactId => payload.contactsById[contactId])
);

const contactIsFetchingSelector = state => state.contact.isFetching;

const mapStateToProps = createSelector(
  [contactsSelector, contactIsFetchingSelector],
  (contacts, isFetching) => ({
    contacts,
    isFetching,
  })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestContacts,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
