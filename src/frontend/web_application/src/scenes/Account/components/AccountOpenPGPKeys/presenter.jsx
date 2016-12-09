import React, { Component, PropTypes } from 'react';
import { withTranslator } from '@gandi/react-translate';
import Icon from '../../../../components/Icon';
import Button from '../../../../components/Button';
import Subtitle from '../../../../components/Subtitle';
import OpenPGPKey from '../../../../components/OpenPGPKey';
import './style.scss';

@withTranslator()
class AccountOpenPGPKeys extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    privateKeys: PropTypes.arrayOf(PropTypes.shape({})),
    importForm: PropTypes.shape({}),
    isLoading: PropTypes.bool,
    onDeleteKey: PropTypes.func,
    onImportKey: PropTypes.func,
    onGenerateKey: PropTypes.func,
    prefetch: PropTypes.func,
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
    };
    this.handleClickEditMode = this.handleClickEditMode.bind(this);
  }

  componentDidMount() {
    if (this.props.prefetch) {
      this.props.prefetch();
    }
  }

  handleClickEditMode() {
    this.setState(prevState => ({
      editMode: !prevState.editMode,
    }));
  }

  render() {
    const {
      __,
      isLoading,
      importForm,
      privateKeys,
      user,
      onDeleteKey,
      onImportKey,
      onGenerateKey,
    } = this.props;

    return (
      <div className="m-account-openpgp">
        <Subtitle
          hr
          actions={(
            <Button
              className="pull-right"
              active={this.state.editMode}
              onClick={this.handleClickEditMode}
            >
              <Icon type="edit" />
              <span className="show-for-sr">{__('account.openpgp.action.edit-keys')}</span>
            </Button>
          )}
        >
          {__('account.openpgp.title')}
        </Subtitle>
        <div className="m-account-openpgp__info">
          <p>
            This feature is in high development process and can evolve quickly. The keys you will
            store here are available on your current browser only. This will not be uploaded on the
            server and you will not able to see it on any other devices.
          </p>
          <p>
            Be warned, the key pair generation is pretty slow and will freeze this page for
            approximatively 20 seconds (depends on your device capacities). A fix is in progress but
            may takes time to become available.
          </p>
        </div>
        {
          privateKeys.map((keyPair, key) => (
            <OpenPGPKey
              key={key}
              className="m-account-openpgp__keys"
              publicKeyArmored={keyPair.publicKeyArmored}
              privateKeyArmored={keyPair.privateKeyArmored}
              editMode={this.state.editMode}
              onDeleteKey={onDeleteKey}
            >
              <Icon type="key" />
            </OpenPGPKey>
          ))
        }
        {
          this.state.editMode && (
            <account-openpgp-key-form
              className="m-account-openpgp__form"
              emails={user.contact.emails}
              onImport={onImportKey}
              onGenerate={onGenerateKey}
              importForm={importForm}
              isLoading={isLoading}
            >
              <Icon type="key" />
            </account-openpgp-key-form>
        )}
      </div>
    );
  }
}

export default AccountOpenPGPKeys;
