import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RemoteIdentityEmail from '../RemoteIdentityEmail';
import TextList from '../../../../components/TextList';

class IdentityForm extends Component {
  static propTypes = {
    contact: PropTypes.shape({}).isRequired,
    onUpdateContact: PropTypes.func,
    allowConnectRemoteEntity: PropTypes.bool,
    onConnectRemoteIdentity: PropTypes.func,
    onDisconnectRemoteIdentity: PropTypes.func,
    remoteIdentities: PropTypes.arrayOf(PropTypes.shape({})),
    i18n: PropTypes.shape({}).isRequired,
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
    this.renderEmail = this.renderEmail.bind(this);
    this.makeHandleAddContactDetail = this.makeHandleAddContactDetail.bind(this);
    this.makeHandleDeleteContactDetail = this.makeHandleDeleteContactDetail.bind(this);

    this.initDetailsTranslations();
  }

  getRemoteIdentity(identityType, identityId) {
    return this.props.remoteIdentities
      .find(
        remoteIdentity => remoteIdentity.identity_type === identityType
          && remoteIdentity.identity_id === identityId
      );
  }

  initDetailsTranslations() {
    const { i18n } = this.props;
    this.detailsTranslations = {
      address_type: {
        work: i18n._('contact.address_type.work'),
        home: i18n._('contact.address_type.home'),
        other: i18n._('contact.address_type.other'),
      },
      im_type: {
        work: i18n._('contact.im_type.work'),
        home: i18n._('contact.im_type.home'),
        other: i18n._('contact.im_type.other'),
        netmeeting: i18n._('contact.im_type.netmeeting'),
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

  renderEmail(email) {
    const {
      allowConnectRemoteEntity,
      onConnectRemoteIdentity,
      onDisconnectRemoteIdentity,
    } = this.props;

    const remoteIdentity = allowConnectRemoteEntity ?
      this.getRemoteIdentity('email', email.email_id) :
      undefined;

    return (
      <RemoteIdentityEmail
        remoteIdentity={remoteIdentity}
        contactSubObjectId={email.email_id}
        onConnect={onConnectRemoteIdentity}
        onDisconnect={onDisconnectRemoteIdentity}
      />
    );
  }

  renderContactDetailsForm() {
    const { contact } = this.props;
    const emails = contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const contactDetails = [
      ...emails.map(detail => this.renderEmail(detail)),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  render() {
    return (
      <div className="m-identity-form">
        { this.renderContactDetailsForm() }
      </div>
    );
  }
}

export default IdentityForm;
