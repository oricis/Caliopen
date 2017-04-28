import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import Link from '../../../../../../components/Link';
import ContactAvatarLetter, { SIZE_SMALL } from '../../../../../../components/ContactAvatarLetter';
import Badge from '../../../../../../components/Badge';
import TextBlock from '../../../../../../components/TextBlock';


const ContactItem = ({ contact, sortView }) => {
  const namePrefix = contact.name_prefix ? `${contact.name_prefix} ` : '';
  const familyName = contact.family_name ? contact.family_name : '';
  const givenName = contact.given_name ? contact.given_name : '';
  const nameSuffix = contact.name_suffix ? `, ${contact.name_suffix}` : '';
  let contactTitle = null;

  if (sortView === 'family_name') {
    contactTitle = `${familyName}${familyName && givenName && ', '}${givenName}`;
  }

  if (sortView === 'given_name') {
    contactTitle = `${givenName} ${familyName}`;
  }

  return (
    <Link noDecoration className="m-contact-list__contact" to={`/contacts/${contact.contact_id}`} key={contact.contact_id}>
      <div className="m-contact-list__contact-avatar">
        <ContactAvatarLetter isRound contact={contact} size={SIZE_SMALL} />
      </div>
      <TextBlock className="m-contact-list__contact-info">
        <span className="m-contact-list__contact-title">{namePrefix} {contactTitle} {nameSuffix}</span>
        {contact.tags && contact.tags.map(tag => (
          <Badge key={uuidV1()} className="m-contact-list__contact-tag">{tag}</Badge>
        ))}
      </TextBlock>
    </Link>
  );
};


ContactItem.propTypes = {
  contact: PropTypes.shape({}).isRequired,
  sortView: PropTypes.oneOf(['given_name', 'family_name']).isRequired,
};

export default ContactItem;
