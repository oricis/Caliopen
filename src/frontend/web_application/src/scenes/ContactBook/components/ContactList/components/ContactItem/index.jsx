import React, { PropTypes } from 'react';
import Link from '../../../../../../components/Link';
import ContactAvatarLetter, { SIZE_SMALL } from '../../../../../../components/ContactAvatarLetter';
import TextBlock from '../../../../../../components/TextBlock';

const ContactItem = ({ contact, sortView }) => {
  let formatView = '';

  if (contact[sortView] === '') {
    formatView = <span>{contact.title}</span>;
  } else {
    if (sortView === 'family_name') {
      formatView = <span>{contact.family_name}, {contact.given_name}</span>;
    }
    if (sortView === 'given_name') {
      formatView = <span>{contact.given_name} {contact.family_name}</span>;
    }
  }

  return (
    <Link noDecoration className="m-contact-list__contact" to={`/contacts/${contact.contact_id}`} key={contact.contact_id}>
      <div className="m-contact-list__col-avatar">
        <ContactAvatarLetter isRound contact={contact} size={SIZE_SMALL} />
      </div>
      <TextBlock className="m-contact-list__col-name">
        {formatView}
      </TextBlock>
    </Link>
  );
};


ContactItem.propTypes = {
  contact: PropTypes.shape({}).isRequired,
  sortView: PropTypes.string.isRequired,
};

export default ContactItem;
