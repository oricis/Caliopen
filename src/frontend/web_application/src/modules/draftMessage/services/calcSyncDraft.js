export const calcSyncDraft = ({ draft, message }) => {
  const { body, subject, identities } = draft;

  const parentId = draft.parent_id || message.parent_id;
  const isInDiscussion = draft.parent_id && draft.parent_id.length > 0;

  return {
    ...message,
    body,
    subject,
    parent_id: parentId,
    identities,
    // in case of reply, participants are calculated by the API
    participants: isInDiscussion ? message.participants : draft.participants,
  };
};
