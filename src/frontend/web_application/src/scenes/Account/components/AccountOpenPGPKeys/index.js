import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const mapDispatchToProps = dispatch => bindActionCreators({
  onDeleteKey: openPGPKeychain.deleteKey,
  onImportKey: openPGPKeychain.importKeyPairChains,
  onGenerateKey: openPGPKeychain.generate,
  prefetch: openPGPKeychain.fetchAll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
