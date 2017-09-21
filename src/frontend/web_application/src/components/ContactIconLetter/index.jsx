import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IconLetter from '../IconLetter';
import { formatName } from '../../services/contact';

class ContactIconLetter extends PureComponent {
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
      <IconLetter word={formatName({ contact, format })} {...props} />
    );
  }
}

export default ContactIconLetter;
