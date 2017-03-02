import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ContactIconLetter from '../../../../components/ContactIconLetter';
import Icon from '../../../../components/Icon';
import './style.scss';

const ContactsIcon = ({ discussion }) => {
  const hasMore = discussion.contacts.length > 4;
  const contacts = discussion.contacts.slice(0, hasMore ? 3 : 4);
  const iconClass = `m-contacts-icon__letter--${hasMore ? 4 : contacts.length}`;

  return (
    <div className="m-contacts-icon">
      {
        contacts.map(contact => (
          <ContactIconLetter
            key={contact.contact_id}
            className={classnames('m-contacts-icon__letter', iconClass)}
            contact={contact}
          />
        ))
      }
      {
        hasMore && <Icon className={classnames('m-contacts-icon__letter', iconClass)} type="plus" />
      }
    </div>
  );
};

ContactsIcon.propTypes = {
  discussion: PropTypes.shape({}).isRequired,
};

export default ContactsIcon;
