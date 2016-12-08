import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ContactAvatarLetter from '../../../../components/ContactAvatarLetter';
import TextBlock from '../../../../components/TextBlock';

const ContactItem = ({ contact }) => (
  <Link
    to={`/contacts/${contact.contact_id}`}
    className="s-contact-list__contact m-block-list__item-content m-block-list__item-content--link"
  >
    <ContactAvatarLetter contact={contact} />
    <TextBlock className="s-contact-list__col-name">{contact.title}</TextBlock>
  </Link>
  );


ContactItem.propTypes = {
  contact: PropTypes.shape({}),
};

export default ContactItem;
