import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, formValues } from 'redux-form';
import { requestContact, updateContact, createContact, deleteContact, invalidate as invalidateContacts } from '../../store/modules/contact';
import { addAddressToContact } from '../../modules/contact';
import { updateTagCollection } from '../../modules/tags';
import { getNewContact } from '../../services/contact';
import { userSelector } from '../../modules/user';
import { withSearchParams } from '../../modules/routing';
import Presenter from './presenter';

const contactIdSelector = (state, ownProps) => ownProps.match.params.contactId;
const contactSelector = state => state.contact;
const dirtyValuesSelector = createSelector(
  [
    (state, ownProps) => ownProps.searchParams,
  ],
  ({ address, protocol, label }) => ({ address, protocol, label })
);

const mapStateToProps = createSelector(
  [userSelector, contactIdSelector, contactSelector, dirtyValuesSelector],
  (user, contactId, contactState, dirtyValues) => {
    const contact = contactState.contactsById[contactId] || getNewContact();
    const { address, protocol, label } = dirtyValues;

    return {
      user,
      contactId,
      contact,
      form: `contact-${contactId || 'new'}`,
      // TODO: the following key fix this bug: https://github.com/erikras/redux-form/issues/2886#issuecomment-299426767
      key: `contact-${contactId || 'new'}`,
      initialValues: {
        ...contact,
        ...(protocol ? addAddressToContact(contact, { address, protocol }) : {}),
        ...(
          label && label.length > 0 &&
          (!contact.given_name || !contact.given_name.length) &&
          (!contact.family_name || !contact.family_name.length) ? { given_name: label } : {}
        ),
      },
      isFetching: contactState.isFetching,
    };
  }
);

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    requestContact,
    updateContact,
    createContact,
    deleteContact,
    invalidateContacts,
    updateTagCollection,
  }, dispatch),
  onSubmit: values => Promise.resolve(values),
});

export default compose(
  withSearchParams(),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
  }),
  formValues({ birthday: 'info.birthday' }),
)(Presenter);
