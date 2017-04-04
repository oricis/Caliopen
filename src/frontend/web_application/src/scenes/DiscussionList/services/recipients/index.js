const Recipients = ({ discussion, user }) => {
  let participants = discussion.participants
    .filter(participant =>
      !participant.contact_ids || participant.contact_ids.indexOf(user.contact_id) === -1
    )
    .map(participant => participant.address)
    ;

  if (participants.length > 4) {
    const rest = `+ ${participants.length - 3}`;
    participants = participants.slice(0, 3);
    participants.push(rest);
  }

  return participants.join(', ');
};

export default Recipients;
