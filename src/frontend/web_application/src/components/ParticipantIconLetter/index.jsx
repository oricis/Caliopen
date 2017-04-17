import React, { PropTypes } from 'react';
import IconLetter from '../IconLetter';

function getParticipantTitle(participant) {
  return participant.label || participant.address;
}

const ParticipantIconLetter = ({ participant, ...props }) => (
  <IconLetter word={getParticipantTitle(participant)} {...props} />
);

ParticipantIconLetter.propTypes = {
  participant: PropTypes.shape({}).isRequired,
};

export default ParticipantIconLetter;
