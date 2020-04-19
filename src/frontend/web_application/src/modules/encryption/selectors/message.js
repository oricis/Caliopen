import { createSelector } from 'reselect';

export const encryptionSelector = (state) => state.encryption;
export const messageEncryptionStatusSelector = createSelector(
  [encryptionSelector],
  (encryptionState) => encryptionState.messageEncryptionStatusById
);
