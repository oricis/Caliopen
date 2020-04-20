import React from 'react';
import PropTypes from 'prop-types';
import WithDraftMessage from '../WithDraftMessage';

export const withDraftMessage = () => (WrappedComp) => {
  const C = ({ internalId, messageId, hasDiscussion, ...props }) => (
    <WithDraftMessage
      internalId={internalId}
      messageId={messageId}
      hasDiscussion={hasDiscussion}
      render={({
        requestDraft,
        draftMessage,
        isRequestingDraft,
        isDeletingDraft,
        original,
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

        return <WrappedComp {...draftMessageProps} {...props} />;
      }}
    />
  );
  C.displayName = `C(${
    WrappedComp.displayName || WrappedComp.name || 'Component'
  })`;
  C.propTypes = {
    internalId: PropTypes.string.isRequired,
    messageId: PropTypes.string,
    hasDiscussion: PropTypes.bool.isRequired,
  };
  C.defaultProps = {
    messageId: undefined,
  };

  return C;
};
