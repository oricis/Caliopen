import React from 'react';
import WithDraftMessage from '../WithDraftMessage';

export const withDraftMessage = () => (WrappedComp) => {
  const C = ({ hasDiscussion, ...props }) => (
    <WithDraftMessage
      hasDiscussion={hasDiscussion}
      render={({
        draftMessage, isRequestingDraft, isDeletingDraft, original,
      }) => {
        const draftMessageProps = {
          hasDiscussion, draftMessage, isRequestingDraft, isDeletingDraft, original,
        };

        return (
          <WrappedComp {...draftMessageProps} {...props} />
        );
      }}
    />
  );
  C.displayName = `C(${WrappedComp.displayName || WrappedComp.name || 'Component'})`;

  return C;
};
