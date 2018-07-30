import { createSelector } from 'reselect';
import { remoteIdentitiesStateSelector } from './remoteIdentityState';

export const remoteIdentitySelector = createSelector(
  [remoteIdentitiesStateSelector, (state, { identityId }) => identityId],
  (remoteIdentityState, identityId) =>
    remoteIdentityState.remoteIdentitiesById[identityId]
);
