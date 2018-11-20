import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from '@lingui/react';
import { deleteContacts } from '../../modules/contact';
import { updateContactTags } from '../../modules/tags';

import { requestContacts, loadMoreContacts, hasMore } from '../../store/modules/contact';
import Presenter from './presenter';

const contactSelector = state => state.contact;
const mapStateToProps = createSelector(
  [contactSelector],
  contactState => ({
    contacts: contactState.contacts.map(contactId => contactState.contactsById[contactId]),
    isFetching: contactState.isFetching,
    didInvalidate: contactState.didInvalidate,
    hasMore: hasMore(contactState),
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestContacts,
  loadMoreContacts,
  deleteContacts,
  updateContactTags,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withI18n(),
)(Presenter);
