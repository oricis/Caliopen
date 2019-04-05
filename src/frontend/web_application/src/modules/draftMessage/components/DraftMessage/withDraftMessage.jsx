import React from 'react';
import PropTypes from 'prop-types';
import WithDraftMessage from '../WithDraftMessage';

export const withDraftMessage = () => (WrappedComp) => {
  const C = ({ internalId, hasDiscussion, ...props }) => (
    <WithDraftMessage
      internalId={internalId}
      hasDiscussion={hasDiscussion}
      render={({
        requestDraft, draftMessage, isRequestingDraft, isDeletingDraft, original,
      }) => {
        const draftMessageProps = {
          internalId,
          hasDiscussion,
          requestDraft,
          draftMessage,
          isRequestingDraft,
          isDeletingDraft,
          original,
        };

        return (
          <WrappedComp {...draftMessageProps} {...props} />
        );
      }}
    />
  );
  C.displayName = `C(${WrappedComp.displayName || WrappedComp.name || 'Component'})`;
  C.propTypes = {
    internalId: PropTypes.string.isRequired,
    hasDiscussion: PropTypes.bool.isRequired,
  };

  return C;
};
