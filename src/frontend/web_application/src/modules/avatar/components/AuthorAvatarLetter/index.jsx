import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderParticipant, getAuthor } from '../../../../services/message';
import AvatarLetterWrapper from '../AvatarLetterWrapper';
import AvatarLetter from '../AvatarLetter';

class AuthorAvatarLetter extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {};

  render() {
    const { message, ...props } = this.props;
    const participant = getAuthor(message);

    return (
      <AvatarLetterWrapper {...props}>
        <AvatarLetter word={renderParticipant(participant)} />
      </AvatarLetterWrapper>
    );
  }
}

export default AuthorAvatarLetter;
