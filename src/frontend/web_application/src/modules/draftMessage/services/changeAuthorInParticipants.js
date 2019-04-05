export const changeAuthorInParticipants = ({ participants, user }) => (
  participants && participants.reduce((acc, participant) => {
    if (participant.contact_ids && participant.contact_ids.includes(user.contact.contact_id)) {
      return [
        ...acc,
        { ...participant, type: 'From' },
      ];
    }

    return [
      ...acc,
      { ...participant, type: 'To' },
    ];
  }, [])
);
