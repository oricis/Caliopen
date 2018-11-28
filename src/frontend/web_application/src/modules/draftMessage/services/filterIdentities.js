const ASSOC_MESSAGE_TYPE_PROTOCOL = {
  email: 'email',
  'DM twitter': 'twitter',
  twitter: 'twitter',
};

const getParticipantsContactsExceptUser = ({ contacts, participants, user }) => participants
  .reduce((acc, participant) => {
    if (!participant.contact_ids) {
      return acc;
    }

    const contactIds = participant.contact_ids
      .filter(contactId => contactId !== user.contact.contact_id);

    if (contactIds.lentgh === 0) {
      return acc;
    }

    return [
      ...acc,
      ...contactIds.map(contactId => contacts.find(contact => contact.contact_id === contactId)),
    ];
  }, []);

const getAvailableProtocolsForTheContact = ({ contact }) => {
  const protocols = [];
  if (contact.emails && contact.emails.length >= 1) {
    protocols.push('email');
  }

  if (contact.identities && contact.identities.filter(identity => identity.type === 'twitter').length >= 1) {
    protocols.push('twitter');
  }

  return protocols;
};

export const filterIdentities = ({
  identities, parentMessage, contacts, user,
}) => {
  if (!parentMessage) {
    return identities;
  }

  // FIXME: message.type migh become message.protocol
  const messageProtocol = ASSOC_MESSAGE_TYPE_PROTOCOL[parentMessage.type];
  if (!messageProtocol) {
    throw new Error(`unkown message type ${parentMessage.type}`);
  }

  const participantsContacts = getParticipantsContactsExceptUser({
    contacts,
    participants: parentMessage.participants,
    user,
  });

  // in a discussion 1-to-n we allow to switch identity of the same protocol
  if (participantsContacts.length === 0 || participantsContacts.lentgh > 1) {
    return identities.filter(identity => identity.protocol === messageProtocol);
  }

  // in a discussion 1-to-1 we allow to switch identity of the protocol that the associated contact
  // can receive
  const [contact] = participantsContacts;
  const availableProtocols = getAvailableProtocolsForTheContact({ contact });

  return identities.filter(identity => availableProtocols.includes(identity.protocol));
};
