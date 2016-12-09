import * as localStorageHelper from './local-storage-helper';

const NAMESPACE = 'openpgp';

export function getPrimaryKeysByFingerprint() {
  return localStorageHelper.findAll(NAMESPACE)
    .reduce((prev, { id, value }) => {
      const fingerprint = id.replace('publicKeyArmored.', '')
        .replace('privateKeyArmored.', '');
      const keyType = id.replace(`.${fingerprint}`, '');

      return {
        ...prev,
        [fingerprint]: {
          ...prev[fingerprint],
          [keyType]: value,
        },
      };
    }, {});
}

export function saveKey(fingerprint, publicKeyArmored, privateKeyArmored) {
  localStorageHelper.save(NAMESPACE, `publicKeyArmored.${fingerprint}`, publicKeyArmored);
  localStorageHelper.save(NAMESPACE, `privateKeyArmored.${fingerprint}`, privateKeyArmored);
}

export function deleteKey(fingerprint) {
  localStorageHelper.remove(NAMESPACE, `publicKeyArmored.${fingerprint}`);
  localStorageHelper.remove(NAMESPACE, `privateKeyArmored.${fingerprint}`);
}
