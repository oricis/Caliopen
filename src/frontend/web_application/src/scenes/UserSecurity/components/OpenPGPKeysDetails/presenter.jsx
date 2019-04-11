import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { Icon, Button } from '../../../../components';
import { getPrimaryKeysByFingerprint, saveKey, deleteKey } from '../../../../services/openpgp-keychain-repository';
import { generateKey, getPublicKeyFromPrivateKey } from '../../../../services/encryption';
import OpenPGPKey from '../OpenPGPKey';
import OpenPGPKeyForm from '../OpenPGPKeyForm';
import './style.scss';

class OpenPGPKeysDetails extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    isLoading: false,
  }

  state = {
    importForm: { errors: {} },
    editMode: false,
    keys: undefined,
    isFormLoading: false,
  };

  componentDidMount() {
    this.updateKeyState({});
  }

  getPrivateKeys = () => Object.values(this.state.keys || {});

  getUserEmails = () => {
    const { user: { contact, title } } = this.props;

    if (contact) {
      return contact.emails.map(({ address }) => ({ name: title, email: address }));
    }

    return null;
  }

  updateKeyState = newState => getPrimaryKeysByFingerprint()
    .then(keys => this.setState(prevState => ({
      ...prevState,
      ...newState,
      keys,
    })));


  handleClickEditMode = () => {
    this.setState(prevState => ({
      editMode: !prevState.editMode,
    }));
  }

  importKeys = async () => {
    const { privateKeyArmored, passphrase } = this.state.importForm;

    this.setState({ isFormLoading: true });
    try {
      const publicKeyArmored = await getPublicKeyFromPrivateKey(privateKeyArmored, passphrase);
      const error = await saveKey(publicKeyArmored, privateKeyArmored);
      const newState = error ?
        {
          isFormLoading: false,
          importForm: { privateKeyArmored, passphrase, errors: { global: [error] } },
        }
        : {
          isFormLoading: false,
          importForm: {
            errors: {},
            privateKeyArmored: '',
            passphrase: '',
          },
        };
      this.updateKeyState(newState);
    } catch (e) {
      this.updateKeyState({
        isFormLoading: false,
        importForm: { privateKeyArmored, passphrase, errors: { global: [e.message] } },
      });
    }
  }

  handleDeleteKey = async ({ fingerprint }) => {
    await deleteKey(fingerprint);

    this.updateKeyState({});
  };

  handleImportFormChange = (newValue) => {
    this.setState(prevState => ({
      importForm: {
        ...prevState.importForm,
        ...newValue,
      },
    }));
  }

  generateAndSaveKeys = async (generateForm) => {
    const options = {
      passphrase: generateForm.passphrase,
      userIds: generateForm.email,
      numbits: 4096,
    };

    const { privateKeyArmored, publicKeyArmored } = await generateKey(options);
    const error = await saveKey(publicKeyArmored, privateKeyArmored);
    const newState = error ? {} : { importForm: {} };
    this.updateKeyState(newState);

    return error;
  }

  renderPrivateKey = (keyPair, key) => (
    <OpenPGPKey
      key={key}
      className="m-account-openpgp__keys"
      publicKeyArmored={keyPair.publicKeyArmored}
      privateKeyArmored={keyPair.privateKeyArmored}
      editMode={this.state.editMode}
      onDeleteKey={this.handleDeleteKey}
    >
      <Icon type="key" />
    </OpenPGPKey>
  );


  render() {
    const {
      isLoading,
      user,
    } = this.props;

    const activeButtonProp = this.state.editMode ? { color: 'active' } : {};

    return (
      <div className="m-account-openpgp">
        {this.getPrivateKeys().map(this.renderPrivateKey)}
        {this.state.editMode ? (
          <div>
            <OpenPGPKeyForm
              className="m-account-openpgp__form"
              emails={user.contact.emails}
              onImport={this.importKeys}
              onGenerate={this.generateAndSaveKeys}
              onImportFormChange={this.handleImportFormChange}
              importForm={this.state.importForm}
              isLoading={isLoading || this.state.isFormLoading}
              cancel={this.handleClickEditMode}
            />
            <div className="m-account-openpgp__info">
              <p>
                This feature is in high development process and can evolve quickly.
                The keys you will store here are available on your current browser only.
                This will not be uploaded on the server and you will not able to see it on any
                other devices.
              </p>
              <p>
                Be warned, the key pair generation is pretty slow and will freeze this page for
                approximatively 20 seconds (depends on your device capacities).
                A fix is in progress but may takes time to become available.
              </p>
            </div>
          </div>
        ) : (
          <Button
            {...activeButtonProp}
            onClick={this.handleClickEditMode}
            shape="plain"
            icon="plus"
          >
            <Trans id="user.openpgp.action.edit-keys">Edit and add keys</Trans>
          </Button>
        )}
      </div>
    );
  }
}

export default OpenPGPKeysDetails;
