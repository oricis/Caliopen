import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Presenter from './presenter';
import * as openPGPKeychain from '../../../../store/modules/openpgp-keychain';

const privateKeysSelector = createSelector(
  state => state.openPGPKeychain,
  openPGPKeychainState => openPGPKeychainState.privateKeys
      .map(fingerprint => openPGPKeychainState.keychainByFingerprint[fingerprint]),
);

const importFormSelector = createSelector(
  state => state.openPGPKeychain,
  openPGPKeychainState => openPGPKeychainState.importForm,
);
const isLoadingSelector = createSelector(
  state => state.openPGPKeychain,
  openPGPKeychainState => openPGPKeychainState.isLoading,
);

const mapStateToProps = state => ({
  privateKeys: privateKeysSelector(state),
  importForm: importFormSelector(state),
  isLoading: isLoadingSelector(state),
});

// XXX: @ziir recommand to use bindActionCreator from redux to reduce code boilerplate and
// consistency in signatures
const mapDispatchToProps = dispatch => ({
  onDeleteKey: ({ fingerprint }) => {
    dispatch(openPGPKeychain.deleteKey(fingerprint));
  },
  onImportKey: ({ publicKeyArmored, privateKeyArmored }) => {
    dispatch(openPGPKeychain.importKeyPairChains(publicKeyArmored, privateKeyArmored));
  },
  onGenerateKey: ({ name, email, passphrase }) => {
    dispatch(openPGPKeychain.generate(name, email, passphrase));
  },
  prefetch: () => {
    dispatch(openPGPKeychain.fetchAll());
  },
});

//
// generateKeys($event) {
//   const { contact: { title: name } } = this.user;
//   const { email, passphrase } = $event;
//
//   this.$ngRedux.dispatch(openPGPKeychain.generate(name, email, passphrase));
// }

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
