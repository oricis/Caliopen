export const sortMessages = (messages, reversed) => messages.sort((a, b) => {
  if (reversed) {
    return new Date(b.date_insert) - new Date(a.date_insert);
  }

  return new Date(a.date_insert) - new Date(b.date_insert);
});

export const renderParticipant = participant => `${participant.label} (${participant.address})`;

export const getLastMessage = messages => sortMessages(messages, true)[0];
