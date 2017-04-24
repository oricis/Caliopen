import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../../../../components/Link';
import ContactAvatarLetter, { SIZE_SMALL } from '../../../../../../components/ContactAvatarLetter';
import TextBlock from '../../../../../../components/TextBlock';

const ContactItem = ({ contact, sortView }) => (
  <Link noDecoration className="m-contact-list__contact" to={`/contacts/${contact.contact_id}`} key={contact.contact_id}>
    <div className="m-contact-list__col-avatar">
      <ContactAvatarLetter isRound contact={contact} size={SIZE_SMALL} />
    </div>
    <TextBlock className="m-contact-list__col-name">
      <span>{contact[sortView]}</span>
    </TextBlock>
  </Link>
);


ContactItem.propTypes = {
  contact: PropTypes.shape({}).isRequired,
  sortView: PropTypes.string.isRequired,
};

export default ContactItem;
