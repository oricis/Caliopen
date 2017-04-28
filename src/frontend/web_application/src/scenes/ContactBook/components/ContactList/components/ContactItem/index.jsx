import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../../../../components/Link';
import ContactAvatarLetter, { SIZE_SMALL } from '../../../../../../components/ContactAvatarLetter';
import TextBlock from '../../../../../../components/TextBlock';
import { SORT_VIEW_FAMILY_NAME, SORT_VIEW_GIVEN_NAME } from './';


function getTitleView(contact, sortView) {
  if (!contact.family_name && !contact.given_name) { return contact.title; }

  switch (sortView) {
    case 'family_name':
      return `${contact.family_name}${contact.family_name && contact.given_name && ', '}${contact.given_name}`;
    default:
    case 'given_name':
      return `${contact.given_name}${contact.family_name && contact.given_name && ' '}${contact.family_name}`;
  }
}

const ContactItem = ({ contact, sortView }) => {
  const contactName = getTitleView(contact, sortView);

  return (
    <Link noDecoration className="m-contact-list__contact" to={`/contacts/${contact.contact_id}`}>
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
  sortView: PropTypes.oneOf([SORT_VIEW_GIVEN_NAME, SORT_VIEW_FAMILY_NAME]).isRequired,
};

export default ContactItem;
