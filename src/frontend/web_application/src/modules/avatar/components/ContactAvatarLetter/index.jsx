import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AvatarLetterWrapper from '../AvatarLetterWrapper';
import AvatarLetter from '../AvatarLetter';
import { formatName } from '../../../../services/contact';

class ContactAvatarLetter extends PureComponent {
  static propTypes = {
    contact: PropTypes.shape({}).isRequired,
    contactDisplayFormat: PropTypes.string,
  };

  static defaultProps = {
    contactDisplayFormat: 'title',
  };

  render() {
    const { contact, contactDisplayFormat: format, ...props } = this.props;

    return (
      <AvatarLetterWrapper {...props}>
        <AvatarLetter word={formatName({ contact, format })} />
      </AvatarLetterWrapper>
    );
  }
}

export default ContactAvatarLetter;
