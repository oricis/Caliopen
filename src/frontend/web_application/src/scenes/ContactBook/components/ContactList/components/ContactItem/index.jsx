import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../../../../components/Link';
import ContactAvatarLetter, { SIZE_SMALL } from '../../../../../../components/ContactAvatarLetter';
import TextBlock from '../../../../../../components/TextBlock';

function getTitleView(contact, sortView) {
  let title = null;
  if (sortView === 'family_name') {
    title = `${contact.family_name}${contact.family_name && contact.given_name && ', '}${contact.given_name}`;
  }

  if (sortView === 'given_name') {
    title = `${contact.given_name} ${contact.family_name}`;
  }

  return title;
}

const ContactItem = ({ contact, sortView }) => {
  const contactName = !contact.family_name && !contact.given_name ?
    contact.title : getTitleView(contact, sortView);

  return (
    <Link noDecoration className="m-contact-list__contact" to={`/contacts/${contact.contact_id}`} key={contact.contact_id}>
      <div className="m-contact-list__contact-avatar">
        <ContactAvatarLetter isRound contact={contact} size={SIZE_SMALL} />
      </div>
      <TextBlock className="m-contact-list__contact-info">
        {contact.name_prefix && <span className="m-contact-list__contact-prefix">{contact.name_prefix}</span>}
        <span className="m-contact-list__contact-title">{contactName}</span>
        {contact.name_suffix && <span className="m-contact-list__contact-suffix">, {contact.name_suffix}</span>}
      </TextBlock>
    </Link>
  );
};


ContactItem.propTypes = {
  contact: PropTypes.shape({}).isRequired,
  sortView: PropTypes.oneOf(['given_name', 'family_name']).isRequired,
};

export default ContactItem;
