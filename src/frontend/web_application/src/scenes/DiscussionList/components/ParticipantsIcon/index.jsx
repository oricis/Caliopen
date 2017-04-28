import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ParticipantIconLetter from '../../../../components/ParticipantIconLetter';
import Icon from '../../../../components/Icon';
import './style.scss';

const ParticipantsIcon = ({ discussion }) => {
  const hasMore = discussion.participants.length > 4;
  const participants = discussion.participants.slice(0, hasMore ? 3 : 4);
  const iconClass = `m-participants-icon__letter--${hasMore ? 4 : participants.length}`;

  return (
    <div className="m-participants-icon">
      {
        participants.map(participant => (
          <ParticipantIconLetter
            key={participant.address}
            className={classnames('m-participants-icon__letter', iconClass)}
            participant={participant}
          />
        ))
      }
      {
        hasMore && <Icon className={classnames('m-participants-icon__letter', iconClass)} type="plus" />
      }
    </div>
  );
};

ParticipantsIcon.propTypes = {
  discussion: PropTypes.shape({}).isRequired,
};

export default ParticipantsIcon;
