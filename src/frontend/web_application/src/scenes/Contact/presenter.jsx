import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { withSettings } from '../../modules/settings';
import { ManageEntityTags, getTagLabel, getCleanedTagCollection } from '../../modules/tags';
import { ContactAvatarLetter } from '../../modules/avatar';
import { withPush } from '../../modules/routing';
import { getAveragePI } from '../../modules/pi';
import fetchLocation from '../../services/api-location';
import { formatName } from '../../services/contact';
import ContactProfileForm from './components/ContactProfileForm';
import { ActionBar, Badge, Button, Confirm, Icon, Modal, PageTitle, PlaceholderBlock, Spinner, TextBlock, TextList, TextItem, Title } from '../../components';
import FormCollection from './components/FormCollection';
import EmailForm from './components/EmailForm';
import PhoneForm from './components/PhoneForm';
import ImForm from './components/ImForm';
import AddressForm from './components/AddressForm';
// FIXME: birthday deactivated due to redux-form bug cf. AddFormFieldForm
// import BirthdayForm from './components/BirthdayForm';
import OrgaForm from './components/OrgaForm';
import IdentityForm from './components/IdentityForm';
import AddFormFieldForm from './components/AddFormFieldForm';
import OrgaDetails from './components/OrgaDetails';
import EmailDetails from './components/EmailDetails';
import PhoneDetails from './components/PhoneDetails';
import ImDetails from './components/ImDetails';
import AddressDetails from './components/AddressDetails';
import IdentityDetails from './components/IdentityDetails';
import BirthdayDetails from './components/BirthdayDetails';

import './style.scss';
import './contact-action-bar.scss';
import './contact-main-title.scss';

@withPush()
@withSettings()
class Contact extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    notifyError: PropTypes.func.isRequired,
    requestContact: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    updateContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired,
    invalidateContacts: PropTypes.func.isRequired,
    contactId: PropTypes.string,
    contact: PropTypes.shape({}),
    user: PropTypes.shape({}),
    form: PropTypes.string.isRequired,
    closeTab: PropTypes.func.isRequired,
    currentTab: PropTypes.shape({}).isRequired,
    settings: PropTypes.shape({}),
    push: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    updateTagCollection: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    // birthday: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    contact: undefined,
    contactId: undefined,
    // birthday: undefined,
    user: undefined,
    settings: undefined,
  };

  state = {
    isTagModalOpen: false,
    editMode: false,
    isFetching: false,
    isSaving: false,
  };

  componentWillMount() {
    if (!this.props.contactId) {
      this.setState({
        editMode: true,
      });
    } else {
      this.setState({ isFetching: true });
    }
  }

  componentDidMount() {
    const { contactId, requestContact } = this.props;
    if (contactId) {
      requestContact(contactId).then(() => this.setState({ isFetching: false }));
    }
  }

  handleOpenTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: true,
    }));
  }

  handleCloseTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: false,
    }));
  }

  toggleEditMode = () => {
    this.setState(prevState => ({
      ...prevState,
      editMode: !prevState.editMode,
    }), () => {
      if (!this.state.editMode) {
        this.props.reset();
      }
    });
  }

  handleCancel = () => {
    const { contactId, closeTab, currentTab } = this.props;
    if (!contactId) {
      closeTab(currentTab);
    }

    return this.toggleEditMode();
  }

  handleDelete = () => {
    const {
      contactId, push, closeTab, invalidateContacts, currentTab,
    } = this.props;
    this.setState({ isFetching: true });
    this.props.deleteContact({ contactId })
      .then(() => invalidateContacts())
      .then(() => this.setState({ isFetching: false }))
      .then(() => push('/contacts'))
      .then(() => closeTab(currentTab));
  }

  createOrUpdateAction = async ({ contact, original }) => {
    const {
      updateContact, requestContact, createContact,
      push, closeTab, currentTab,
    } = this.props;
    if (contact.contact_id) {
      await updateContact({ contact, original });

      return requestContact(contact.contact_id);
    }

    const resultAction = await createContact({ contact });
    const { location } = resultAction.payload.data;
    const { data: contactCreated } = await fetchLocation(location);

    push(`/contacts/${contactCreated.contact_id}`);
    closeTab(currentTab);

    return contactCreated;
  };

  handleSubmit = (ev) => {
    const {
      i18n, handleSubmit, contactId, notifyError, contact: original,
    } = this.props;
    this.setState({ isSaving: true });
    handleSubmit(ev)
      .then(contact => this.createOrUpdateAction({ contact, original }))
      .then(() => contactId && this.toggleEditMode(), () => {
        notifyError({ message: i18n._('contact.feedback.unable_to_save', null, { defaults: 'Unable to save the contact' }) });
      })
      .then(() => this.setState({ isSaving: false }));
  }

  handleTagsChange = async ({ tags }) => {
    const { updateTagCollection, i18n, contact: entity } = this.props;

    return updateTagCollection(i18n, { type: 'contact', entity, tags });
  }

  renderTagsModal = () => {
    const { contact, i18n } = this.props;
    const nb = contact && contact.tags ? contact.tags.length : 0;
    const title = (
      <Trans
        id="tags.header.title"
        defaults={'Tags <0>(Total: {nb})</0>'}
        values={{ nb }}
        components={[
          (<span className="m-tags-form__count" />),
        ]}
      />
    );

    return (
      <Modal
        isOpen={this.state.isTagModalOpen}
        contentLabel={i18n._('tags.header.label', null, { defaults: 'Tags' })}
        title={title}
        onClose={this.handleCloseTags}
      >
        <ManageEntityTags entity={contact} onChange={this.handleTagsChange} />
      </Modal>
    );
  }

  renderActionBar() {
    const { contactId, user, submitting } = this.props;
    const contactIsUser = contactId && user && user.contact.contact_id === contactId;
    const hasActivity = submitting || this.state.isFetching || this.state.isSaving;

    return (
      <ActionBar
        className="s-contact-action-bar"
        isFetching={hasActivity}
        actionsNode={(
          <Fragment>
            <Trans id="contact.action-bar.label">Contact:</Trans>
            {!contactIsUser && contactId && (
              <Confirm
                onConfirm={this.handleDelete}
                title={(<Trans id="contact.confirm-delete.title">Delete the contact</Trans>)}
                content={(<Trans id="contact.confirm-delete.content">The deletion is permanent, are you sure you want to delete this contact ?</Trans>)}
                render={confirm => (
                  <Button
                    className="s-contact-action-bar__action-btn"
                    onClick={confirm}
                    display="inline"
                    icon={this.state.isDeleting ? (<Spinner isLoading display="inline" />) : 'trash'}
                    noDecoration
                  >
                    <Trans id="contact.action.delete_contact">Delete</Trans>
                  </Button>
                )}
              />
            )}
            {!this.state.editMode && (
              <Button
                className="s-contact-action-bar__action-btn"
                onClick={this.toggleEditMode}
                display="inline"
                noDecoration
                icon="list-ul"
              >
                <Trans id="contact.action.edit_contact">Edit contact</Trans>
              </Button>
            )}
            <Button
              className="s-contact-action-bar__action-btn"
              onClick={this.handleOpenTags}
              display="inline"
              noDecoration
              icon="tag"
            >
              <Trans id="contact.action.edit_tags">Edit tags</Trans>
            </Button>
            {this.renderTagsModal()}
            {/* <Button onClick={this.handleDelete}><Trans>Add to favorites</Trans></Button>
            <Button onClick={this.handleDelete}><Trans>New discussion</Trans></Button> */}
          </Fragment>
        )}
      />
    );
  }

  renderTags() {
    const { tags, contact, i18n } = this.props;

    return contact && contact.tags && (
      <div className="s-contact__tags">
        {getCleanedTagCollection(tags, contact.tags).map(tag => (
          <Badge key={tag.name} rightSpaced>{getTagLabel(i18n, tag)}</Badge>
        ))}
      </div>
    );
  }

  renderMainTitle() {
    const { contact, settings: { contact_display_format: format } } = this.props;
    const { organizations = [] } = contact;
    const averagePI = contact.pi ? getAveragePI(contact.pi) : ' - ';

    return (
      <Fragment>
        <div className="s-contact-main-title__avatar">
          <ContactAvatarLetter
            contact={contact}
            contactDisplayFormat={format}
            size="large"
          />
        </div>
        <div className="s-contact-main-title__name">
          {formatName({ contact, format })}
        </div>

        <div className="s-contact-main-title__pi">
          {averagePI}
        </div>

        {organizations.length > 0 && (
          <TextBlock className="s-contact-main-title__organizations">
            <Icon type="building" rightSpaced />
            <Trans id="contact.organizations">
              Organizations:
            </Trans>
            {' '}
            {organizations.map(orga => (
              <OrgaDetails key={orga.organization_id} organization={orga} />
            ))}
          </TextBlock>
        )}
        {/* <ContactStats className="stats" /> */}
      </Fragment>
    );
  }

  renderEmail = email => (
    <TextItem className="s-contact__detail" key={email.email_id}>
      <EmailDetails email={email} />
    </TextItem>
  );

  renderPhone = phone => (
    <TextItem className="s-contact__detail" key={phone.phone_id}>
      <PhoneDetails phone={phone} />
    </TextItem>
  );

  renderIm = im => (
    <TextItem className="s-contact__detail" key={im.im_id}>
      <ImDetails im={im} />
    </TextItem>
  );

  renderAddress = address => (
    <TextItem className="s-contact__detail" key={address.address_id}>
      <AddressDetails address={address} />
    </TextItem>
  );

  renderIdentity = identity => (
    <TextItem className="s-contact__detail">
      <IdentityDetails identity={identity} />
    </TextItem>
  );

  renderBirthday = birthday => (
    <TextItem className="s-contact__detail" key={birthday}>
      <BirthdayDetails
        birthday={birthday}
      />
    </TextItem>
  );

  renderContactDetails() {
    const { contact } = this.props;

    const emails = contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const {
      identities = [],
      ims = [],
      addresses = [],
      phones = [],
      infos,
    } = contact;

    const restOfDetails = [
      ...identities.map(identity => this.renderIdentity(identity)),
      ...ims.map(detail => this.renderIm(detail)),
      ...addresses.map(detail => this.renderAddress(detail)),
      ...(infos ? [this.renderBirthday(infos.birthday ? infos.birthday : '')] : []),
    ];

    return (
      <Fragment>
        <Title hr><Trans id="contact.contact-details.title">Contact details</Trans></Title>
        <TextList className="s-contact__details-group">
          {emails.map(email => this.renderEmail(email))}
        </TextList>
        <TextList className="s-contact__details-group">
          {phones.map(phone => this.renderPhone(phone))}
        </TextList>
        <TextList className="s-contact__details-group">
          {restOfDetails.map((C, key) => <C.type {...C.props} key={key} />)}
        </TextList>
      </Fragment>
    );
  }

  renderKeys = () => (
    <Fragment>
      <Title hr><Trans id="contact.keys.title">Public keys</Trans></Title>
    </Fragment>
  );

  renderLastMessages = () => (
    <Fragment>
      <Title hr><Trans id="contact.last-messages.title">Last messages</Trans></Title>
    </Fragment>
  );

  renderEditBar = () => {
    const { pristine, submitting } = this.props;
    const hasActivity = submitting || this.state.isSaving;

    return (
      <div className="s-contact__edit-bar">
        <Button
          onClick={this.handleCancel}
          responsive="icon-only"
          icon="remove"
          className="s-contact__action"
        >
          <Trans id="contact.action.cancel_edit">Cancel</Trans>
        </Button>
        <Button
          type="submit"
          responsive="icon-only"
          icon={hasActivity ? (<Spinner isLoading display="inline" />) : 'check'}
          className="s-contact__action"
          disabled={pristine || hasActivity}
        >
          <Trans id="contact.action.validate_edit">Validate</Trans>
        </Button>
      </div>
    );
  }

  renderEditMode() {
    const { form, contact } = this.props;
    // const hasBirthday = this.props.birthday !== undefined;

    return (
      <div className="s-contact__form">
        <form onSubmit={this.handleSubmit} method="post">
          <Title hr><Trans id="contact.edit_contact.title">Edit the contact</Trans></Title>
          <ContactProfileForm form={form} isNew={!contact} />
          <div>
            <Title hr><Trans id="contact.contact-details.title">Contact details</Trans></Title>
            <FormCollection component={(<EmailForm />)} propertyName="emails" showAdd={false} />
            <FormCollection component={(<PhoneForm />)} propertyName="phones" showAdd={false} />
            <FormCollection component={(<ImForm />)} propertyName="ims" showAdd={false} />
            <FormCollection component={(<AddressForm />)} propertyName="addresses" showAdd={false} />
            {/* {hasBirthday && (<BirthdayForm form={form} />)} */}
            <AddFormFieldForm form={form} />
          </div>
          <Title hr><Trans id="contact.organization">Organization</Trans></Title>
          <FormCollection
            component={(<OrgaForm />)}
            propertyName="organizations"
            addButtonLabel={<Trans id="contact.action.add-organization">Add an organization</Trans>}
          />

          <Title hr><Trans id="contact.identities">Identities</Trans></Title>
          <FormCollection
            component={(<IdentityForm />)}
            propertyName="identities"
            addButtonLabel={<Trans id="contact.action.add-identity">Add an identity</Trans>}
          />
          {this.renderEditBar()}
        </form>
      </div>
    );
  }

  renderPlaceholder = () => (
    <div className="s-contact">
      <PageTitle />
      <ActionBar
        className="s-contact-action-bar"
        isFetching
        actionsNode={(
          <Fragment>
            <PlaceholderBlock shape="line" display="inline-block" width="small" />:
            <PlaceholderBlock shape="line" display="inline-block" />
            <PlaceholderBlock shape="line" display="inline-block" width="large" />
          </Fragment>
        )}
      />
      <div className="s-contact__tags">
        <PlaceholderBlock shape="line" display="inline-block" width="small" />
        <PlaceholderBlock shape="line" display="inline-block" />
      </div>
      <div className="s-contact__main-title s-contact-main-title">
        <div className="s-contact-main-title__avatar">
          <PlaceholderBlock shape="avatar" size="large" />
        </div>
        <div className="s-contact-main-title__name">
          <PlaceholderBlock display="inline-block" width="large" />
        </div>

        <div className="s-contact-main-title__pi">
          <PlaceholderBlock shape="square" />
        </div>
      </div>
      <div className="s-contact__contact-details">
        <Title hr><PlaceholderBlock shape="line" display="inline-block" width="large" /></Title>
        <TextList className="s-contact__details-group">
          <TextItem><PlaceholderBlock shape="line" display="inline-block" width="xlarge" /></TextItem>
          <TextItem><PlaceholderBlock shape="line" display="inline-block" width="xlarge" /></TextItem>
          <TextItem><PlaceholderBlock shape="line" display="inline-block" width="xlarge" /></TextItem>
        </TextList>
      </div>
    </div>
  );

  render() {
    const { contact } = this.props;

    if (!contact && !this.state.editMode) {
      return this.renderPlaceholder();
    }

    return (
      <div className="s-contact">
        <PageTitle />
        {this.renderActionBar()}

        {this.renderTags()}
        {this.state.editMode ? this.renderEditMode() : (
          <Fragment>
            <div className="s-contact__main-title s-contact-main-title">
              {this.renderMainTitle()}
            </div>
            <div className="s-contact__contact-details">
              {this.renderContactDetails()}
            </div>
            {/* <div className="s-contact__keys">
              {this.renderKeys()}
            </div> */}
            {/* <div className="s-contact__last-messages">
              {this.renderLastMessages()}
            </div> */}
          </Fragment>
        )}
      </div>
    );
  }
}

export default Contact;
