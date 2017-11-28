export const sortMessages = (messages, reversed) => messages.sort((a, b) => {
  if (reversed) {
    return new Date(b.date_insert) - new Date(a.date_insert);
  }

  return new Date(a.date_insert) - new Date(b.date_insert);
});

export const renderParticipant = participant => `${participant.label} (${participant.address})`;

export const getLastMessage = messages => sortMessages(messages, true)[0];

export const getAuthor = message => message.participants && message.participants.find(participant => participant.type === 'From');

export const isMessageFromUser = (message, user) => {
  const author = getAuthor(message);
  const authorId = author && author.contact_ids[0];
  const userId = user && user.contact.contact_id;

  return userId && authorId && userId === authorId;
};
