import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ContactAvatarLetter from '../../../../components/ContactAvatarLetter';

const ContactItem = ({ contact }) => (
  <Link
    to={`/contacts/${contact.contact_id}`}
    className="s-contact-list__contact m-block-list__item-content m-block-list__item-content--link"
  >
    <ContactAvatarLetter contact={contact} />
    <div className="s-contact-list__col-name m-text-line">
      {contact.title}
    </div>
  </Link>
  );


ContactItem.propTypes = {
  contact: PropTypes.shape({}),
};

export default ContactItem;

// const ContactItem = `
//   <Link to={`/contacts/${contact.contact_id}`}
//     class="s-contact-list__contact m-block-list__item-content m-block-list__item-content--link"
//   >
//     <div class="s-contact-list__col-avatar">
//       <contact-avatar-letter contact="$ctrl.contact" props="{ size: 'small' }">
//       </contact-avatar-letter>
//     </div>
//     <div class="s-contact-list__col-name m-text-line">
//       {contact.title}
//     </div>
//     <div class="s-contact-list__col-datas">
//     </div>
//   </Link>
// `;
