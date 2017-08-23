import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Subtitle from '../Subtitle';
import TextList, { ItemContent } from '../TextList';
import AddressDetails from './components/AddressDetails';
import BirthdayDetails from './components/BirthdayDetails';
import EmailDetails from './components/EmailDetails';
import PhoneDetails from './components/PhoneDetails';
import PhoneForm from './components/PhoneForm';
import OrgaDetails from './components/OrgaDetails';
import OrgaForm from './components/OrgaForm';
import IdentityDetails from './components/IdentityDetails';
import ImDetails from './components/ImDetails';
import AddressForm from './components/AddressForm';
import EmailForm from './components/EmailForm';
import ImForm from './components/ImForm';
import IdentityForm from './components/IdentityForm';
import FormSelector from './components/FormSelector';

import './style.scss';

class ContactDetails extends Component {
  static propTypes = {
    contact: PropTypes.shape({}).isRequired,
    onUpdateContact: PropTypes.func,
    allowConnectRemoteEntity: PropTypes.bool,
    onConnectRemoteIdentity: PropTypes.func,
    onDisconnectRemoteIdentity: PropTypes.func,
    remoteIdentities: PropTypes.arrayOf(PropTypes.shape({})),
    editMode: PropTypes.bool.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    allowConnectRemoteEntity: false,
    onUpdateContact: () => {},
    onConnectRemoteIdentity: () => {},
    onDisconnectRemoteIdentity: () => {},
    remoteIdentities: [],
  };

  constructor(props) {
    super(props);
    this.initDetailsTranslations();
  }

  getRemoteIdentity = (identityType, identityId) => {
    this.props.remoteIdentities
      .find(
        remoteIdentity => remoteIdentity.identity_type === identityType
          && remoteIdentity.identity_id === identityId
      );
  }

  initDetailsTranslations() {
    const { __ } = this.props;
    this.detailsTranslations = {
      address_type: {
        work: __('contact.address_type.work'),
        home: __('contact.address_type.home'),
        other: __('contact.address_type.other'),
      },
      im_type: {
        work: __('contact.im_type.work'),
        home: __('contact.im_type.home'),
        other: __('contact.im_type.other'),
        netmeeting: __('contact.im_type.netmeeting'),
      },
    };
  }

  makeHandleAddContactDetail = (type) => {
    const { onUpdateContact, contact } = this.props;

    return ({ contactDetail }) => onUpdateContact({
      contact: {
        ...contact,
        [type]: [
          ...(contact[type] ? contact[type] : []),
          contactDetail,
        ],
      },
      original: contact,
    });
  }

  makeHandleDeleteContactDetail = (type) => {
    const { onUpdateContact, contact } = this.props;

    return ({ contactDetail }) => onUpdateContact({
      contact: {
        ...contact,
        [type]: contact[type].filter(entity => entity !== contactDetail),
      },
      original: contact,
    });
  }

  renderEmail = (email) => {
    const {
      __,
      allowConnectRemoteEntity,
      onConnectRemoteIdentity,
      onDisconnectRemoteIdentity,
      editMode,
    } = this.props;

    const remoteIdentity = allowConnectRemoteEntity ?
      this.getRemoteIdentity('email', email.email_id) :
      undefined;

    return (
      <ItemContent large>
        <EmailDetails
          email={email}
          allowConnectRemoteEntity={allowConnectRemoteEntity}
          remoteIdentity={remoteIdentity}
          editMode={editMode}
          onDelete={this.makeHandleDeleteContactDetail('emails')}
          onConnectRemoteIdentity={onConnectRemoteIdentity}
          onDisconnectRemoteIdentity={onDisconnectRemoteIdentity}
          __={__}
        />
      </ItemContent>
    );
  }

  renderPhone = (phone) => {
    const { __, editMode } = this.props;

    return (
      <ItemContent large>
        <PhoneDetails
          phone={phone}
          editMode={editMode}
          onEdit={str => str} // FIXME should be edit function
          onDelete={this.makeHandleDeleteContactDetail('phones')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderIm = (im) => {
    const { __, editMode } = this.props;

    return (
      <ItemContent large>
        <ImDetails
          im={im}
          editMode={editMode}
          onDelete={this.makeHandleDeleteContactDetail('ims')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderAddress = (address) => {
    const { __, editMode } = this.props;

    return (
      <ItemContent large>
        <AddressDetails
          address={address}
          editMode={editMode}
          onDelete={this.makeHandleDeleteContactDetail('addresses')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderBirthday = (date) => {
    const { __, editMode } = this.props;

    return (
      <ItemContent large>
        <BirthdayDetails
          birthday={date}
          editMode={editMode}
          __={__}
        />
      </ItemContent>
    );
  }

  renderContactDetails = () => {
    const { contact } = this.props;
    const emails = contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const contactDetails = [
      ...emails.map(detail => this.renderEmail(detail)),
      ...(contact.phones ? contact.phones.map(detail => this.renderPhone(detail)) : []),
      ...(contact.ims ? contact.ims.map(detail => this.renderIm(detail)) : []),
      ...(contact.addresses ? contact.addresses.map(detail => this.renderAddress(detail)) : []),
      ...(contact.infos && contact.infos.birthday ?
        [this.renderBirthday(contact.infos.birthday)] : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderFormSelector = () => {
    const { __ } = this.props;

    const formsOptions = [
      { name: __('contact.form-selector.add_new_field.label'), obj: null },
      { name: __('contact.form-selector.email_form.label'), obj: (<EmailForm onSubmit={this.makeHandleAddContactDetail('emails')} __={__} />) },
      { name: __('contact.form-selector.phone_form.label'), obj: (<PhoneForm onSubmit={this.makeHandleAddContactDetail('phones')} __={__} />) },
      { name: __('contact.form-selector.im_form.label'), obj: (<ImForm onSubmit={this.makeHandleAddContactDetail('ims')} __={__} />) },
      { name: __('contact.form-selector.address_form.label'), obj: (<AddressForm onSubmit={this.makeHandleAddContactDetail('addresses')} __={__} />) },
    ];

    return (
      <FormSelector __={__} formsOptions={formsOptions} />
    );
  }

  renderContactDetailsForm = () => {
    const { __, contact } = this.props;
    const emails = contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const contactDetails = [
      ...emails.map(detail => this.renderEmail(detail)),
      ...(contact.phones ? contact.phones.map(detail =>
        (<PhoneForm
          phone={detail}
          onDelete={this.makeHandleDeleteContactDetail('phones')}
          onEdit={str => str} // FIXME: should be edit function
          __={__}
        />)
      ) : []),
      ...(contact.ims ? contact.ims.map(detail => this.renderIm(detail)) : []),
      ...(contact.addresses ? contact.addresses.map(detail => this.renderAddress(detail)) : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  render() {
    const { __, contact, editMode } = this.props;

    return (
      <div className="m-contact-details">
        <div className="m-contact-details__panel">
          <Subtitle hr>
            {__('contact.contact_details')}
          </Subtitle>
          <div className="m-contact-details__list">
            {editMode ?
              this.renderContactDetailsForm() :
              this.renderContactDetails()
            }
            <div className="m-contact-details__new-form">
              {editMode && this.renderFormSelector()}
            </div>
          </div>
        </div>

        <div className="m-contact-details__panel">
          <Subtitle hr>
            {__('contact.contact_organizations')}
          </Subtitle>
          <div className="m-contact-details__list">
            <TextList>
              {contact.organizations && contact.organizations.map(organization => (
                <OrgaDetails
                  key={organization.organization_id}
                  organization={organization}
                  editMode={editMode}
                  onDelete={this.makeHandleDeleteContactDetail('organizations')}
                  __={__}
                />
              ))}
            </TextList>
            {editMode && (
              <OrgaForm onSubmit={this.makeHandleAddContactDetail('organizations')} __={__} />
            )}
          </div>
        </div>

        <div className="m-contact-details__panel">
          <Subtitle hr>
            {__('contact.contact_identities')}
          </Subtitle>
          <div className="m-contact-details__list">
            <TextList>
              {contact.identities && contact.identities.map(identity => (
                <IdentityDetails
                  key={identity.name}
                  identity={identity}
                  editMode={editMode}
                  onDelete={this.makeHandleDeleteContactDetail('identities')}
                  __={__}
                />
              ))}
            </TextList>
            {editMode && (
              <IdentityForm onSubmit={this.makeHandleAddContactDetail('identities')} __={__} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ContactDetails;
