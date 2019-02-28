import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { Icon } from '../../../../components';

import './style.scss';

class LockedMessage extends PureComponent {
  static propTypes = {
    encryptionStatus: PropTypes.shape({}),
  };

  static defaultProps = {
    encryptionStatus: undefined,
  };

  renderStatusText = () => {
    const { encryptionStatus } = this.props;

    if (!encryptionStatus) {
      return <Trans id="encryption.locked-message.status.no-detail">…</Trans>;
    }

    switch (encryptionStatus.status) {
      case 'need_passphrase':
        return <Trans id="encryption.locked-message.status.need_passphrase">Enter your passphrase to unlock.</Trans>;
      case 'decrypting':
        return <Trans id="encryption.locked-message.status.decrypting">Decryption in progress…</Trans>;
      case 'need_privatekey':
        return <Trans id="encryption.locked-message.status.need_privatekey">No available private key can decrypt this message.</Trans>;
      case 'error':
        return <Trans id="encryption.locked-message.status.error">Error while trying to decrypt.</Trans>;
      default:
        return <Trans id="encryption.locked-message.status.no-detail">Error while trying to decrypt.</Trans>;
    }
  };

  render() {
    return (
      <div className="m-encryption-locked_message">
        <div className="m-encryption-locked_message__message">
          <Icon type="lock" className="m-encryption-locked_message__icon" />
          <Trans id="encryption.locked-message.primary-text">Le contenu de ce message est chiffré.</Trans><br />
          <span className="m-encryption-locked_message__status m-encryption-locked_message__status--error">{this.renderStatusText()}</span>
        </div>
      </div>
    );
  }
}

export default LockedMessage;
