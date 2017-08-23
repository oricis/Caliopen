import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import Button from '../../../Button';
import RemoteIdentityEmail from '../RemoteIdentityEmail';

class EmailDetails extends Component {
  static propTypes = {
    email: PropTypes.shape({}).isRequired,
    remoteIdentity: PropTypes.shape({}),
    editMode: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    allowConnectRemoteEntity: PropTypes.bool,
    onConnectRemoteIdentity: PropTypes.func,
    onDisconnectRemoteIdentity: PropTypes.func,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    remoteIdentity: undefined,
    editMode: false,
    allowConnectRemoteEntity: false,
    onConnectRemoteIdentity: undefined,
    onDisconnectRemoteIdentity: undefined,
  };

  constructor(props) {
    super(props);
    this.initTranslations();
  }

  state = {
    connectIdentityEditMode: false,
  };

  handleToggleConnectIdentityForm = () => {
    this.setState(prevState => ({ connectIdentityEditMode: !prevState.connectIdentityEditMode }));
  }

  initTranslations() {
    const { __ } = this.props;
    this.emailTypesTranslations = {
      work: __('contact.email_type.work'),
      home: __('contact.email_type.home'),
      other: __('contact.email_type.other'),
    };
  }

  handleDelete= () => {
    const { onDelete, email } = this.props;
    onDelete({ contactDetail: email });
  }

  renderConnectIdentityToggleButton= () => {
    const { remoteIdentity, __ } = this.props;
    const successButtonProp = (remoteIdentity && remoteIdentity.connected) && { color: 'success' };

    return (
      <Button
        icon="plug"
        onClick={this.handleToggleConnectIdentityForm}
        {...successButtonProp}
      >
        {' '}
        <Icon type={this.state.connectIdentityEditMode ? 'caret-up' : 'caret-down'} />
        <span className="show-for-sr">{__('user.action.connect_identity')}</span>
      </Button>
    );
  }

  renderDeleteButton() {
    const { __ } = this.props;

    return (
      <Button onClick={this.handleDelete} color="alert">
        <Icon type="remove" />
        <span className="show-for-sr">{__('contact.action.delete_contact_detail')}</span>
      </Button>
    );
  }

  render() {
    const {
      allowConnectRemoteEntity,
      email,
      remoteIdentity,
      editMode,
      onConnectRemoteIdentity,
      onDisconnectRemoteIdentity,
      __,
    } = this.props;

    const address = !email.is_primary ?
      email.address :
      (<strong title={__('contact.primary')}>{email.address}</strong>);

    return (
      <span className="m-email-details">
        <Icon rightSpaced type="envelope" />
        {address}
        {' '}
        <small><em>{this.emailTypesTranslations[email.type]}</em></small>
        {allowConnectRemoteEntity && this.renderConnectIdentityToggleButton()}
        {editMode && this.renderDeleteButton()}
        {this.state.connectIdentityEditMode && (
          <RemoteIdentityEmail
            remoteIdentity={remoteIdentity}
            contactSubObjectId={email.email_id}
            onConnect={onConnectRemoteIdentity}
            onDisconnect={onDisconnectRemoteIdentity}
            __={__}
          />
        )}
      </span>
    );
  }
}

export default EmailDetails;
