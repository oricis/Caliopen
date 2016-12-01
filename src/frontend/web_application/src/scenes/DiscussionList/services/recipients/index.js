const Recipients = ({ discussion, user }) => {
  let contacts = discussion.contacts
    .filter(contact => contact.contact_id !== user.contact_id)
    .map(contact => contact.address)
    ;

  if (contacts.length > 4) {
    const rest = `+ ${contacts.length - 3}`;
    contacts = contacts.slice(0, 3);
    contacts.push(rest);
  }

  return contacts.join(', ');
};

export default Recipients;
