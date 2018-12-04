import React from 'react';
import { withRouter } from 'react-router-dom';

export const withCurrentInternalId = () => (C) => {
  const WithCurrentInternalId = ({
    history, match, location, ...props
  }) => {
    const internalId = match.params.discussionId || match.params.internalId;

    return (<C internalId={internalId} {...props} />);
  };
  WithCurrentInternalId.displayName = `WithCurrentInternalId(${C.displayName || C.name || 'Component'})`;

  return withRouter(WithCurrentInternalId);
};
