import { createSelector } from 'reselect';
import { remoteIdentitiesStateSelector } from './remoteIdentityState';

export const remoteIdentitiesSelector = createSelector(
  [remoteIdentitiesStateSelector],
  remoteIdentityState => remoteIdentityState.remoteIdentities
    .map(identityId => remoteIdentityState.remoteIdentitiesById[identityId])
);
