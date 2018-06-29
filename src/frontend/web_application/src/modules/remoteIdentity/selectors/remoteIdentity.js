import { createSelector } from 'reselect';
import { remoteIdentitiesStateSelector } from './remoteIdentityState';

export const remoteIdentitySelector = createSelector(
  [remoteIdentitiesStateSelector, (state, { remoteId }) => remoteId],
  (remoteIdentityState, remoteId) =>
    remoteIdentityState.remoteIdentitiesById[remoteId]
);
