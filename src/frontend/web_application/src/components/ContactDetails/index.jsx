/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Subtitle from '../Subtitle';
import Button from '../Button';
import TextList, { ItemContent } from '../TextList';
import AddressDetails from './components/AddressDetails';
import EmailDetails from './components/EmailDetails';
import PhoneDetails from './components/PhoneDetails';
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
    onAddContactDetail: PropTypes.func.isRequired,
    onDeleteContactDetail: PropTypes.func.isRequired,
    allowConnectRemoteEntity: PropTypes.bool,
    onConnectRemoteIdentity: PropTypes.func,
    onDisconnectRemoteIdentity: PropTypes.func,
    remoteIdentities: PropTypes.arrayOf(PropTypes.shape({})),
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    allowConnectRemoteEntity: false,
    onDisconnectRemoteIdentity: () => {},
    remoteIdentities: [],
  };

  constructor(props) {
    super(props);
    this.handleSwitchEditMode = this.handleSwitchEditMode.bind(this);
    this.renderAddress = this.renderAddress.bind(this);
    this.renderEmail = this.renderEmail.bind(this);
    this.renderPhone = this.renderPhone.bind(this);
    this.renderIm = this.renderIm.bind(this);
    this.state = {
      editMode: {
        details: false,
        organizations: false,
        identities: false,
      },
    };

    this.initDetailsTranslations();
  }

  initDetailsTranslations() {
    const { __ } = this.props;
    this.detailsTranslations = {
      'address_type': {
        'work':  __('contact.address_type.work'),
        'home':  __('contact.address_type.home'),
        'other':  __('contact.address_type.other'),
      },
      'im_type': {
        'work': __('contact.im_type.work'),
        'home': __('contact.im_type.home'),
        'other': __('contact.im_type.other'),
        'netmeeting': __('contact.im_type.netmeeting'),
      },
    };
  }

  handleSwitchEditMode(ev) {
    const panel = ev.target.value;

    this.setState(prevState => ({
      editMode: {
        [panel]: !prevState.editMode[panel],
      }
    }));
  }

  getRemoteIdentity(identityType, identityId) {
    return this.props.remoteIdentities
      .find(
        (remoteIdentity) => remoteIdentity.identity_type === identityType
          && remoteIdentity.identity_id === identityId);
  }

  renderSubtitleActions(panel) {
    const { __ } = this.props;
    const activeButtonProp = this.state.editMode[panel] ? { color: 'active' } : {};

    return (
      <Button
        className="pull-right"
        {...activeButtonProp}
        value={panel}
        onClick={this.handleSwitchEditMode}
        icon="edit"
      >
        <span className="show-for-sr">{__('contact.action.edit_contact_details')}</span>
      </Button>
    );
  }
  renderEmail(email, key) {
    const {
      __,
      allowConnectRemoteEntity,
      onDeleteContactDetail,
      onConnectRemoteIdentity,
      onDisconnectRemoteIdentity,
    } = this.props;

    const editMode = this.state.editMode;

    const remoteIdentity = allowConnectRemoteEntity ?
      this.getRemoteIdentity('email', email.email_id) :
      undefined;

    return (
      <ItemContent key={key} large>
        <EmailDetails
          email={email}
          allowConnectRemoteEntity={allowConnectRemoteEntity}
          remoteIdentity={remoteIdentity}
          editMode={editMode.details}
          onDelete={onDeleteContactDetail}
          onConnectRemoteIdentity={onConnectRemoteIdentity}
          onDisconnectRemoteIdentity={onDisconnectRemoteIdentity}
          __={__}
        />
      </ItemContent>
    );
  }

  renderPhone(phone, key) {
    const { __, onDeleteContactDetail } = this.props;
    const editMode = this.state.editMode;

    return (
      <ItemContent key={key} large>
        <PhoneDetails phone={phone} editMode={editMode.details} onDelete={onDeleteContactDetail} __={__} />
      </ItemContent>
    )
  }

  renderIm(im, key) {
    const { __, onDeleteContactDetail } = this.props;
    const editMode = this.state.editMode;

    return (
      <ItemContent key={key} large>
        <ImDetails im={im} editMode={editMode.details} onDelete={onDeleteContactDetail} __={__} />
      </ItemContent>
    )
  }

  renderAddress(address, key) {
    const { __, onDeleteContactDetail } = this.props;
    const editMode = this.state.editMode;

    return (
      <ItemContent key={key} large>
        <AddressDetails address={address} editMode={editMode.details} onDelete={onDeleteContactDetail} __={__} />
      </ItemContent>
    )
  }

  render() {
    const { __, contact, onAddContactDetail, onDeleteContactDetail } = this.props;
    const editMode = this.state.editMode;

    let detailKey = 0;
    let contactDetails = [];
    const emails = contact.emails.sort((a, b) => a.address.localeCompare(b.address));
    contactDetails = contactDetails.concat(emails.map(detail => {
      detailKey++;
      return this.renderEmail(detail, detailKey);
    }));
    if (editMode.details) {
      detailKey++;
      contactDetails = contactDetails.concat(<EmailForm key={detailKey} onSubmit={onAddContactDetail} __={__} />);
    }
    contactDetails = contactDetails
      .concat(contact.phones.map(detail => {
        detailKey++;

        return this.renderPhone(detail, detailKey);
      }))
      .concat(contact.ims.map(detail => {
        detailKey++;

        return this.renderIm(detail, detailKey);
      }));
    if (editMode.details) {
      detailKey++;
      contactDetails = contactDetails.concat(<ImForm key={detailKey} onSubmit={onAddContactDetail} __={__} />);
    }
    contactDetails = contactDetails.concat(contact.addresses.map(detail => {
        detailKey++;

        return this.renderAddress(detail, detailKey);
      }));

    if (editMode.details) {
      detailKey++;
      contactDetails = contactDetails.concat(<AddressForm key={detailKey} onSubmit={onAddContactDetail} __={__} />);
    }

    return (

      <div className="m-contact-details">
        <div className="m-contact-details__panel">
          <Subtitle hr actions={this.renderSubtitleActions('details')}>
            {__('contact.contact_details')}
          </Subtitle>
          <div className="m-contact-details__list">
            <TextList>{contactDetails}</TextList>
          </div>
        </div>
        {contact.organizations !== {} &&
          <div className="m-contact-details__panel">
            <Subtitle hr actions={this.renderSubtitleActions('organizations')}>
              {__('contact.contact_organizations')}
            </Subtitle>
              <div className="m-contact-details__list">
                <TextList>
                {contact.organizations.map(organization =>
                    <OrgaDetails
                      key={organization.organization_id}
                      organization={organization}
                      editMode={editMode.organizations}
                      onDelete={onDeleteContactDetail}
                      __={__} />
                  )}
                  </TextList>
                {editMode.organizations && <OrgaForm onSubmit={onAddContactDetail} __={__}/>}
              </div>
          </div>
        }
        {contact.identities !== [] &&
          <div className="m-contact-details__panel">
            <Subtitle hr actions={this.renderSubtitleActions('identities')}>
              {__('contact.contact_identities')}
            </Subtitle>
              <div className="m-contact-details__list">
                <TextList>
                  {contact.identities.map(identity =>
                    <IdentityDetails
                      key={identity.value}
                      identity={identity}
                      editMode={editMode.identities}
                      onDelete={onDeleteContactDetail}
                      __={__} />
                    )}
                </TextList>
                {editMode.identities && <IdentityForm onSubmit={onAddContactDetail} __={__}/>}
              </div>
          </div>
        }
      </div>
    );
  }
}

export default ContactDetails;
