/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Subtitle from '../Subtitle';
import Button from '../Button';
import Icon from '../Icon';
import TextList, { ItemContent } from '../TextList';
import AddressDetails from './components/AddressDetails';
import EmailDetails from './components/EmailDetails';
import PhoneDetails from './components/PhoneDetails';
import ImDetails from './components/ImDetails';
import AddressForm from './components/AddressForm';
import EmailForm from './components/EmailForm';
import ImForm from './components/ImForm';
import './style.scss';

class ContactDetails extends Component {
  static propTypes = {
    contact: PropTypes.shape({}),
    onAddContactDetail: PropTypes.func.isRequired,
    onDeleteContactDetail: PropTypes.func.isRequired,
    allowConnectRemoteEntity: PropTypes.bool,
    onConnectRemoteIdentity: PropTypes.func,
    onDisconnectRemoteIdentity: PropTypes.func,
    remoteIdentities: PropTypes.arrayOf(PropTypes.shape({})),
    __: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleSwitchEditMode = this.handleSwitchEditMode.bind(this);
    this.renderAddress = this.renderAddress.bind(this);
    this.renderEmail = this.renderEmail.bind(this);
    this.renderPhone = this.renderPhone.bind(this);
    this.renderIm = this.renderIm.bind(this);
    this.state = {
      editMode: false,
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

  handleSwitchEditMode() {
    this.setState(prevState => ({
      editMode: !prevState.editMode,
    }));
  }

  getRemoteIdentity(identityType, identityId) {
    return this.props.remoteIdentities
      .find(
        (remoteIdentity) => remoteIdentity.identity_type === identityType
          && remoteIdentity.identity_id === identityId);
  }

  renderSubtitleActions() {
    const { __ } = this.props;
    return (
      <Button
        className="pull-right"
        active={this.state.editMode}
        onClick={this.handleSwitchEditMode}
      >
        <Icon type="edit" />
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
    const remoteIdentity = allowConnectRemoteEntity ?
      this.getRemoteIdentity('email', email.email_id) :
      undefined;

    return (
      <ItemContent key={key} large>
        <EmailDetails
          email={email}
          allowConnectRemoteEntity={allowConnectRemoteEntity}
          remoteIdentity={remoteIdentity}
          editMode={this.state.editMode}
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

    return (
      <ItemContent key={key} large>
        <PhoneDetails phone={phone} editMode={this.state.editMode} onDelete={onDeleteContactDetail} __={__} />
      </ItemContent>
    )
  }

  renderIm(im, key) {
    const { __, onDeleteContactDetail } = this.props;

    return (
      <ItemContent key={key} large>
        <ImDetails im={im} editMode={this.state.editMode} onDelete={onDeleteContactDetail} __={__} />
      </ItemContent>
    )
  }

  renderAddress(address, key) {
    const { __, onDeleteContactDetail } = this.props;

    return (
      <ItemContent key={key} large>
        <AddressDetails address={address} editMode={this.state.editMode} onDelete={onDeleteContactDetail} __={__} />
      </ItemContent>
    )
  }

  render() {
    const { __, contact, onAddContactDetail } = this.props;
    let detailKey = 0;
    let contactDetails = [];
    const emails = contact.emails.sort((a, b) => a.address.localeCompare(b.address));
    contactDetails = contactDetails.concat(emails.map(detail => {
      detailKey++;
      return this.renderEmail(detail, detailKey);
    }));
    if (this.state.editMode) {
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
    if (this.state.editMode) {
      detailKey++;
      contactDetails = contactDetails.concat(<ImForm key={detailKey} onSubmit={onAddContactDetail} __={__} />);
    }
    contactDetails = contactDetails.concat(contact.addresses.map(detail => {
        detailKey++;

        return this.renderAddress(detail, detailKey);
      }));

    if (this.state.editMode) {
      detailKey++;
      contactDetails = contactDetails.concat(<AddressForm key={detailKey} onSubmit={onAddContactDetail} __={__} />);
    }


    return (
      <div className="m-contact-details">
        <Subtitle hr actions={this.renderSubtitleActions()}>
          {__('contact.contact_details')}
        </Subtitle>

        <div className="m-contact-details__list">
          <TextList>{contactDetails}</TextList>
        </div>
      </div>
    );
  }
}

export default ContactDetails;
