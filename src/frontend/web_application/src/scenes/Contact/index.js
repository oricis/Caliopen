import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, formValues } from 'redux-form';
import { withI18n } from 'lingui-react';
import { requestContact, updateContact, createContact, deleteContact, invalidate as invalidateContacts } from '../../store/modules/contact';
import { withNotification } from '../../modules/userNotify';
import { updateTagCollection, withTags } from '../../modules/tags';
import { getNewContact } from '../../services/contact';
import { userSelector } from '../../modules/user';
import { withCloseTab, withCurrentTab } from '../../modules/tab';
import Presenter from './presenter';

const contactIdSelector = (state, ownProps) => ownProps.match.params.contactId;
const contactSelector = state => state.contact;

const mapStateToProps = createSelector(
  [userSelector, contactIdSelector, contactSelector],
  (user, contactId, contactState) => ({
    user,
    contactId,
    contact: contactState.contactsById[contactId],
    form: `contact-${contactId || 'new'}`,
    // TODO: the following key fix this bug: https://github.com/erikras/redux-form/issues/2886#issuecomment-299426767
    key: `contact-${contactId || 'new'}`,
    initialValues: contactState.contactsById[contactId] || getNewContact(),
    isFetching: contactState.isFetching,
  })
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
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
  }),
  formValues({ birthday: 'info.birthday' }),
  withI18n(),
  withNotification(),
  withTags(),
  withCloseTab(),
  withCurrentTab(),
)(Presenter);
