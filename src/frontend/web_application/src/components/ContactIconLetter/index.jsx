import React from 'react';
import PropTypes from 'prop-types';
import IconLetter from '../IconLetter';
import './style.scss';

function getContactTitle(contact) {
  return contact.title || contact.address;
}

const ContactIconLetter = ({ contact, ...props }) => (
  <IconLetter word={getContactTitle(contact)} {...props} />
);

ContactIconLetter.propTypes = {
  contact: PropTypes.shape({}).isRequired,
};

export default ContactIconLetter;
