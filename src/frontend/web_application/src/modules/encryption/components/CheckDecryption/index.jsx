import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'redux';
import { createSelector } from 'reselect';
import { Trans } from '@lingui/react';
import { AskPassphraseForm } from '../AskPassphraseForm';

const messageEncryptionStatusSelector = state => state.encryption.messageEncryptionStatusById;
const lockedMessagesSelector = messagesIds => createSelector(
  [messageEncryptionStatusSelector],
  encryptionState => ({
    lockedMessagesByKey: messagesIds.reduce((acc, messageId) => {
      const messageStatus = encryptionState[messageId];

      if (messageStatus && messageStatus.status === 'need_passphrase') {
        return {
          ...acc,
          [messageStatus.fingerprint]: acc[messageStatus.fingerprint] + 1,
        };
      }

      return acc;
    }, {}),
    keyLessMessages: messagesIds.reduce((acc, messageId) =>
      (encryptionState[messageId] && encryptionState[messageId].status === 'need_privatekey' ? acc + 1 : acc), 0),
  })
);

const mapStateToProps = (state, ownProps) =>
  lockedMessagesSelector(ownProps.messages.map(message => message.message_id));

@connect(mapStateToProps)
class CheckDecryption extends Component {
  static propTypes = {
    // message is mandatory for mapStateToProps calculation.
    // eslint-disable-next-line react/no-unused-prop-types
    messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    lockedMessagesByKey: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    keyLessMessages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  render() {
    const { lockedMessagesByKey, keyLessMessages } = this.props;

    return (
      <section className="m-check-decryption">
        {Object.entries(lockedMessagesByKey).map(([fingerprint, numberMessages]) => (
          <AskPassphraseForm
            fingerprint={fingerprint}
            numberMessages={numberMessages}
            key={fingerprint}
          />
        ))}
        {(keyLessMessages > 0) && (
          <div className="m-check-decryption__missing-key">
            <Trans id="encryption.messages.missing-key">{`${keyLessMessages}`} cannot be decrypted with available secret keys.</Trans>
          </div>
        )}
      </section>
    );
  }
}

export default CheckDecryption;
