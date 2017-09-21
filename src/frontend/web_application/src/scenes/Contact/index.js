import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, formValues } from 'redux-form';
import { withTranslator } from '@gandi/react-translate';
import { requestContact, updateContact } from '../../store/modules/contact';
import Presenter from './presenter';

const contactIdSelector = (state, ownProps) => ownProps.match.params.contactId;
const contactSelector = state => state.contact;
const settingsSelector = state => state.settings.settings;

const mapStateToProps = createSelector(
  [contactIdSelector, contactSelector, settingsSelector],
  (contactId, contactState, { contact_display_format }) => ({
    contactId,
    contact: contactState.contactsById[contactId],
    form: `contact-${contactId}`,
    // TODO: the following key fix this bug: https://github.com/erikras/redux-form/issues/2886#issuecomment-299426767
    key: `contact-${contactId}`,
    initialValues: contactState.contactsById[contactId],
    isFetching: contactState.isFetching,
    contact_display_format,
  })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestContact,
  onSubmit: (values, disp, props) =>
    updateContact({ contact: values, original: props.initialValues }),
  updateContact,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
  }),
  formValues({ birthday: 'info.birthday' }),
  withTranslator()
)(Presenter);
