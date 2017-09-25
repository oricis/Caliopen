import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ParticipantIconLetter from '../../../../components/ParticipantIconLetter';
import './style.scss';

const getAuthor = message => message.participants.find(participant => participant.type === 'To');

class AuthorAvatar extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
  };

  render() {
    const participant = getAuthor(this.props.message);

    return (
      <div className="s-author-avatar">
        <ParticipantIconLetter className="s-author-avatar__letter" participant={participant} />
      </div>
    );
  }
}

export default AuthorAvatar;
