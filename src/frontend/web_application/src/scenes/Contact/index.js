import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { requestContact } from '../../store/modules/contact';
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
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
