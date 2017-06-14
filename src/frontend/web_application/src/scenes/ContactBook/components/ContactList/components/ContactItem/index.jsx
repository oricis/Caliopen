import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../../../../components/Link';
import ContactAvatarLetter, { SIZE_SMALL } from '../../../../../../components/ContactAvatarLetter';
import TextBlock from '../../../../../../components/TextBlock';

import { SORT_VIEW_FAMILY_NAME, SORT_VIEW_GIVEN_NAME, SORT_VIEW_TITLE } from '../../../../../ContactBook/presenter';

function getTitleView(contact, sortView) {
  const familyName = contact[SORT_VIEW_FAMILY_NAME] || '';
  const givenName = contact[SORT_VIEW_GIVEN_NAME] || '';
  const title = contact[SORT_VIEW_TITLE] || '';

  if (!familyName && !givenName) { return title; }

  switch (sortView) {
    case SORT_VIEW_FAMILY_NAME:
      return `${familyName}${familyName && givenName && ', '}${givenName}`;
    default:
    case SORT_VIEW_GIVEN_NAME:
      return `${givenName}${familyName && givenName && ' '}${familyName}`;
  }
}

const ContactItem = ({ contact, sortView }) => (
  <Link noDecoration className="m-contact-list__contact" to={`/contacts/${contact.contact_id}`}>
    <div className="m-contact-list__contact-avatar">
      <ContactAvatarLetter isRound contact={contact} size={SIZE_SMALL} />
    </div>
    <TextBlock className="m-contact-list__contact-info">
      {contact.name_prefix && (<span className="m-contact-list__contact-prefix">{contact.name_prefix}</span>)}
      <span className="m-contact-list__contact-title">{getTitleView(contact, sortView)}</span>
      {contact.name_suffix && (<span className="m-contact-list__contact-suffix">, {contact.name_suffix}</span>)}
    </TextBlock>
  </Link>
);


ContactItem.propTypes = {
  contact: PropTypes.shape({}).isRequired,
  sortView: PropTypes.string.isRequired,
};

export default ContactItem;
