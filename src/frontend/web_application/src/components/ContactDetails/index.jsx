import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Subtitle from '../Subtitle';
import Button from '../Button';
import TextList, { ItemContent } from '../TextList';
import AddressDetails from './components/AddressDetails';
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
import './style.scss';

class ContactDetails extends Component {
  static propTypes = {
    contact: PropTypes.shape({}).isRequired,
    onUpdateContact: PropTypes.func,
    allowConnectRemoteEntity: PropTypes.bool,
    onConnectRemoteIdentity: PropTypes.func,
    onDisconnectRemoteIdentity: PropTypes.func,
    remoteIdentities: PropTypes.arrayOf(PropTypes.shape({})),
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
    this.makeHandleSwitchEditMode = this.makeHandleSwitchEditMode.bind(this);
    this.renderAddress = this.renderAddress.bind(this);
    this.renderEmail = this.renderEmail.bind(this);
    this.renderPhone = this.renderPhone.bind(this);
    this.renderIm = this.renderIm.bind(this);
    this.makeHandleAddContactDetail = this.makeHandleAddContactDetail.bind(this);
    this.makeHandleDeleteContactDetail = this.makeHandleDeleteContactDetail.bind(this);
    this.state = {
      editMode: {
        details: false,
        organizations: false,
        identities: false,
      },
    };

    this.initDetailsTranslations();
  }

  getRemoteIdentity(identityType, identityId) {
    return this.props.remoteIdentities
      .find(
        remoteIdentity => remoteIdentity.identity_type === identityType
          && remoteIdentity.identity_id === identityId
      );
  }

  makeHandleSwitchEditMode(panel) {
    return () => {
      this.setState(prevState => ({
        editMode: {
          ...prevState.editMode,
          [panel]: !prevState.editMode[panel],
        },
      }));
    };
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

  makeHandleAddContactDetail(type) {
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

  makeHandleDeleteContactDetail(type) {
    const { onUpdateContact, contact } = this.props;

    return ({ contactDetail }) => onUpdateContact({
      contact: {
        ...contact,
        [type]: contact[type].filter(entity => entity !== contactDetail),
      },
      original: contact,
    });
  }

  renderSubtitleActions(panel) {
    const { __ } = this.props;
    const activeButtonProp = this.state.editMode[panel] ? { color: 'active' } : {};

    return (
      <Button
        className="pull-right"
        {...activeButtonProp}
        onClick={this.makeHandleSwitchEditMode(panel)}
        icon="edit"
      >
        <span className="show-for-sr">{__('contact.action.edit_contact_details')}</span>
      </Button>
    );
  }

  renderEmail(email) {
    const {
      __,
      allowConnectRemoteEntity,
      onConnectRemoteIdentity,
      onDisconnectRemoteIdentity,
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
          editMode={this.state.editMode.details}
          onDelete={this.makeHandleDeleteContactDetail('emails')}
          onConnectRemoteIdentity={onConnectRemoteIdentity}
          onDisconnectRemoteIdentity={onDisconnectRemoteIdentity}
          __={__}
        />
      </ItemContent>
    );
  }

  renderPhone(phone) {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <PhoneDetails
          phone={phone}
          editMode={this.state.editMode.details}
          onDelete={this.makeHandleDeleteContactDetail('phones')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderIm(im) {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <ImDetails
          im={im}
          editMode={this.state.editMode.details}
          onDelete={this.makeHandleDeleteContactDetail('ims')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderAddress(address) {
    const { __ } = this.props;

    return (
      <ItemContent large>
        <AddressDetails
          address={address}
          editMode={this.state.editMode.details}
          onDelete={this.makeHandleDeleteContactDetail('addresses')}
          __={__}
        />
      </ItemContent>
    );
  }

  renderContactDetails() {
    const { contact } = this.props;
    const emails = contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const contactDetails = [
      ...emails.map(detail => this.renderEmail(detail)),
      ...(contact.phones ? contact.phones.map(detail => this.renderPhone(detail)) : []),
      ...(contact.ims ? contact.ims.map(detail => this.renderIm(detail)) : []),
      ...(contact.addresses ? contact.addresses.map(detail => this.renderAddress(detail)) : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderContactDetailsForm() {
    const { __, contact } = this.props;
    const emails = contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const contactDetails = [
      ...emails.map(detail => this.renderEmail(detail)),
      (<EmailForm onSubmit={this.makeHandleAddContactDetail('emails')} __={__} />),
      ...(contact.phones ? contact.phones.map(detail => this.renderPhone(detail)) : []),
      (<PhoneForm onSubmit={this.makeHandleAddContactDetail('phones')} __={__} />),
      ...(contact.ims ? contact.ims.map(detail => this.renderIm(detail)) : []),
      (<ImForm onSubmit={this.makeHandleAddContactDetail('ims')} __={__} />),
      ...(contact.addresses ? contact.addresses.map(detail => this.renderAddress(detail)) : []),
      (<AddressForm onSubmit={this.makeHandleAddContactDetail('addresses')} __={__} />),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  render() {
    const { __, contact } = this.props;

    return (
      <div className="m-contact-details">
        <div className="m-contact-details__panel">
          <Subtitle hr actions={this.renderSubtitleActions('details')}>
            {__('contact.contact_details')}
          </Subtitle>
          <div className="m-contact-details__list">
            {this.state.editMode.details ?
              this.renderContactDetailsForm() :
              this.renderContactDetails()}

          </div>
        </div>

        <div className="m-contact-details__panel">
          <Subtitle hr actions={this.renderSubtitleActions('organizations')}>
            {__('contact.contact_organizations')}
          </Subtitle>
          <div className="m-contact-details__list">
            <TextList>
              {contact.organizations && contact.organizations.map(organization => (
                <OrgaDetails
                  key={organization.organization_id}
                  organization={organization}
                  editMode={this.state.editMode.organizations}
                  onDelete={this.makeHandleDeleteContactDetail('organizations')}
                  __={__}
                />
              ))}
            </TextList>
            {this.state.editMode.organizations && (
              <OrgaForm onSubmit={this.makeHandleAddContactDetail('organizations')} __={__} />
            )}
          </div>
        </div>

        <div className="m-contact-details__panel">
          <Subtitle hr actions={this.renderSubtitleActions('identities')}>
            {__('contact.contact_identities')}
          </Subtitle>
          <div className="m-contact-details__list">
            <TextList>
              {contact.identities && contact.identities.map(identity => (
                <IdentityDetails
                  key={identity.value}
                  identity={identity}
                  editMode={this.state.editMode.identities}
                  onDelete={this.makeHandleDeleteContactDetail('identities')}
                  __={__}
                />
              ))}
            </TextList>
            {this.state.editMode.identities && (
              <IdentityForm onSubmit={this.makeHandleAddContactDetail('identities')} __={__} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ContactDetails;
