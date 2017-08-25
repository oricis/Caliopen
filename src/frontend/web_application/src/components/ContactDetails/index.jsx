import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Subtitle from '../Subtitle';
import TextList, { ItemContent } from '../TextList';
import AddressDetails from './components/AddressDetails';
import BirthdayDetails from './components/BirthdayDetails';
import EmailDetails from './components/EmailDetails';
import IdentityDetails from './components/IdentityDetails';
import ImDetails from './components/ImDetails';
import OrgaDetails from './components/OrgaDetails';
import PhoneDetails from './components/PhoneDetails';
import AddressForm from './components/AddressForm';
import EmailForm from './components/EmailForm';
import IdentityForm from './components/IdentityForm';
import ImForm from './components/ImForm';
import OrgaForm from './components/OrgaForm';
import PhoneForm from './components/PhoneForm';
import FormButton from './components/FormButton';
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

  // TODO: makeHandleEditContactDetail()


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

  renderEmailForm = (email) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <EmailForm
          email={email}
          onDelete={this.makeHandleDeleteContactDetail('emails')}
          onEdit={str => str} // FIXME: should be edit function
          __={__}
        />
      </ItemContent>
    );
  }

  renderPhone = (phone) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <PhoneDetails phone={phone} __={__} />
      </ItemContent>
    );
  }

  renderPhoneForm = (phone) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <PhoneForm
          phone={phone}
          onDelete={this.makeHandleDeleteContactDetail('phones')}
          onEdit={str => str} // FIXME: should be edit function
          __={__}
        />
      </ItemContent>
    );
  }

  renderIm = (im) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <ImDetails im={im} __={__} />
      </ItemContent>
    );
  }

  renderImForm = (im) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <ImForm
          im={im}
          onEdit={str => str} // FIXME: should be edit function
          onDelete={this.makeHandleDeleteContactDetail('ims')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderAddress = (address) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <AddressDetails address={address} __={__} />
      </ItemContent>
    );
  }

  renderAddressForm = (address) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <AddressForm
          address={address}
          onEdit={str => str} // FIXME: should be edit function
          onDelete={this.makeHandleDeleteContactDetail('addresses')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderIdentity = (identity) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <IdentityDetails identity={identity} __={__} />
      </ItemContent>
    );
  }

  renderIdentityForm = (identity) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <IdentityForm
          identity={identity}
          onEdit={str => str} // FIXME: should be edit function
          onDelete={this.makeHandleDeleteContactDetail('identities')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderOrganization = (organization) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <OrgaDetails organization={organization} __={__} />
      </ItemContent>
    );
  }

  renderOrganizationForm = (organization) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <OrgaForm
          organization={organization}
          onEdit={str => str} // FIXME: should be edit function
          onDelete={this.makeHandleDeleteContactDetail('organizations')}
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
    const infos = contact.infos;
    const emails = contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const contactDetails = [
      ...emails.map(detail => this.renderEmail(detail)),
      ...(contact.phones ? contact.phones.map(detail => this.renderPhone(detail)) : []),
      ...(contact.ims ? contact.ims.map(detail => this.renderIm(detail)) : []),
      ...(contact.addresses ? contact.addresses.map(detail => this.renderAddress(detail)) : []),
      ...(infos && infos.birthday ? [this.renderBirthday(infos.birthday)] : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderFormSelector = () => {
    const { __, contact } = this.props;

    const emailOption = {
      name: __('contact.form-selector.email_form.label'),
      obj: (<EmailForm onSubmit={this.makeHandleAddContactDetail('emails')} __={__} />),
    };

    const phoneOption = {
      name: __('contact.form-selector.phone_form.label'),
      obj: (<PhoneForm onSubmit={this.makeHandleAddContactDetail('phones')} __={__} />),
    };

    const imOption = {
      name: __('contact.form-selector.im_form.label'),
      obj: (<ImForm onSubmit={this.makeHandleAddContactDetail('ims')} __={__} />),
    };

    const addressOption = {
      name: __('contact.form-selector.address_form.label'),
      obj: (<AddressForm onSubmit={this.makeHandleAddContactDetail('addresses')} __={__} />),
    };

    const formsOptions = [
      { name: ' - ', obj: null },
      !contact.emails ? emailOption : null,
      !contact.phones ? phoneOption : null,
      !contact.ims ? imOption : null,
      !contact.addresses ? addressOption : null,
    ].filter(option => option !== null); // only return new forms for empty contact's attributes

    return (
      <FormSelector __={__} formsOptions={formsOptions} />
    );
  }

  renderAddFormButton = (form) => {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <FormButton __={__}>{form}</FormButton>
      </ItemContent>
    );
  }

  renderContactDetailsForm = () => {
    const { contact, __ } = this.props;

    const newEmailForm = <EmailForm onSubmit={this.makeHandleAddContactDetail('emails')} __={__} />;
    const newPhoneForm = <PhoneForm onSubmit={this.makeHandleAddContactDetail('phones')} __={__} />;
    const newImForm = <ImForm onSubmit={this.makeHandleAddContactDetail('ims')} __={__} />;
    const newAddressForm = <AddressForm onSubmit={this.makeHandleAddContactDetail('addresses')} __={__} />;

    const emails = contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const contactDetails = [
      ...emails.map(detail => this.renderEmailForm(detail)),
      ...(contact.emails ? [this.renderAddFormButton(newEmailForm)] : []),
      ...(contact.phones ? contact.phones.map(detail => (this.renderPhoneForm(detail))) : []),
      ...(contact.phones ? [this.renderAddFormButton(newPhoneForm)] : []),
      ...(contact.ims ? contact.ims.map(detail => this.renderImForm(detail)) : []),
      ...(contact.ims ? [this.renderAddFormButton(newImForm)] : []),
      ...(contact.addresses ? contact.addresses.map(detail => this.renderAddressForm(detail)) : []),
      ...(contact.addresses ? [this.renderAddFormButton(newAddressForm)] : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderOrganizationsDetails = () => {
    const { contact } = this.props;

    const contactDetails = [
      ...(contact.organizations ?
        contact.organizations.map(detail => this.renderOrganization(detail)) : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderOrganizationsDetailsForm = () => {
    const { contact, __ } = this.props;

    const newOrganizationForm = <OrgaForm onSubmit={this.makeHandleAddContactDetail('organizations')} __={__} />;

    const organisationsDetails = [
      ...(contact.organizations ?
        contact.organizations.map(detail => (this.renderOrganizationForm(detail))) : []),
      ...([this.renderAddFormButton(newOrganizationForm)]),
    ];

    return (
      <TextList>
        {organisationsDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderIdentitiesDetails = () => {
    const { contact } = this.props;

    const contactDetails = [
      ...(contact.identities ?
        contact.identities.map(detail => this.renderIdentity(detail)) : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderIdentitiesDetailsForm = () => {
    const { contact, __ } = this.props;
    const newIdentityForm = <IdentityForm onSubmit={this.makeHandleAddContactDetail('identities')} __={__} />;

    const identitiesDetails = [
      ...(contact.identities ?
        contact.identities.map(detail => (this.renderIdentityForm(detail))) : []),
      ...([this.renderAddFormButton(newIdentityForm)]),
    ];

    return (
      <TextList>
        {identitiesDetails.map((C, key) => <C.type {...C.props} key={key} />)}
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
            {editMode &&
              (!contact.emails || !contact.phones || !contact.ims || !contact.addresses) &&
              // if at least one contact's attribute is empty
              <div className="m-contact-details__new-form">
                {this.renderFormSelector()}
              </div>
            }
          </div>
        </div>

        <div className="m-contact-details__panel">
          <Subtitle hr>{__('contact.contact_organizations')}</Subtitle>
          <div className="m-contact-details__list">
            {editMode ?
              this.renderOrganizationsDetailsForm() :
              this.renderOrganizationsDetails()
            }
          </div>
        </div>

        <div className="m-contact-details__panel">
          <Subtitle hr>{__('contact.contact_identities')}</Subtitle>
          <div className="m-contact-details__list">
            {editMode ?
              this.renderIdentitiesDetailsForm() :
              this.renderIdentitiesDetails()
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ContactDetails;
