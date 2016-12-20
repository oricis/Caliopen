import openPGPKeychainReducer, * as ducks from './openpgp-keychain';

describe('Reducer openPGPKeychain', () => {
  describe('reduce RECEIVE_ALL', () => {
    it('reduce private key', () => {
      const action = {
        type: ducks.RECEIVE_ALL,
        payload: {
          keychainByFingerprint: {
            aef123: {
              publicKeyArmored: '-----BEGIN PGP PUBLIC KEY BLOCK----- ...',
              privateKeyArmored: '-----BEGIN PGP PRIVATE KEY BLOCK----- ...',
            },
          },
        },
      };

      const state = openPGPKeychainReducer(undefined, action);
      expect(state.keychainByFingerprint).toEqual(action.payload.keychainByFingerprint);
      expect(state.privateKeys).toEqual(['aef123']);
    });

    it('reduce public key only', () => {
      const action = {
        type: ducks.RECEIVE_ALL,
        payload: {
          keychainByFingerprint: {
            aef123: {
              publicKeyArmored: '-----BEGIN PGP PUBLIC KEY BLOCK----- ...',
            },
          },
        },
      };

      const state = openPGPKeychainReducer(undefined, action);
      expect(state.keychainByFingerprint).toEqual(action.payload.keychainByFingerprint);
      expect(state.privateKeys).toEqual([]);
    });
  });

  describe('reduce IMPORT*', () => {
    it('reduce IMPORT_KEY_PAIR', () => {
      const action = {
        type: ducks.IMPORT_KEY_PAIR,
        payload: {
          publicKeyArmored: '-----BEGIN PGP PUBLIC KEY BLOCK----- ...',
          privateKeyArmored: '-----BEGIN PGP PRIVATE KEY BLOCK----- ...',
        },
      };

      const state = openPGPKeychainReducer(undefined, action);
      expect(state.importForm).toEqual({ ...action.payload, errors: {} });
    });

    it('reduce IMPORT_PUBLIC_KEY', () => {
      const action = {
        type: ducks.IMPORT_PUBLIC_KEY,
        payload: {
          publicKeyArmored: '-----BEGIN PGP PUBLIC KEY BLOCK----- ...',
        },
      };

      const state = openPGPKeychainReducer(undefined, action);
      expect(state.importForm).toEqual({ ...action.payload, errors: {} });
    });

    it('reduce IMPORT_FAILED', () => {
      const action = {
        type: ducks.IMPORT_FAILED,
        payload: {
          errors: {
            publicKeyArmored: ['failed'],
          },
        },
      };

      const state = openPGPKeychainReducer(undefined, action);
      expect(state.importForm).toEqual({ errors: action.payload.errors });
    });

    it('reduce IMPORT_CANCEL', () => {
      const action = {
        type: ducks.IMPORT_FAILED,
        payload: {
          errors: {
            publicKeyArmored: ['failed'],
          },
        },
      };

      const livingState = openPGPKeychainReducer(undefined, action);
      const state = openPGPKeychainReducer(livingState, {
        type: ducks.IMPORT_CANCEL,
        payload: {},
      });
      expect(state.importForm).toEqual({ errors: {} });
    });

    it('reduce IMPORT_SUCCEED', () => {
      const action = {
        type: ducks.IMPORT_PUBLIC_KEY,
        payload: {
          publicKeyArmored: '-----BEGIN PGP PUBLIC KEY BLOCK----- ...',
        },
      };

      const livingState = openPGPKeychainReducer(undefined, action);
      const state = openPGPKeychainReducer(livingState, {
        type: ducks.IMPORT_SUCCEED,
        payload: {},
      });
      expect(state.importForm).toEqual({ errors: {} });
    });
  });
});
