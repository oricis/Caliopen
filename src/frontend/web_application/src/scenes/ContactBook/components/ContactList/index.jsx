import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import Title from '../../../../components/Title';
import ContactItem from './components/ContactItem';
import { SORT_VIEW_FAMILY_NAME, SORT_VIEW_GIVEN_NAME } from './';

import './style.scss';

function getFirstLetter(string, defaultLetter = '?') {
  let firstLetter = defaultLetter;
  if (string) {
    firstLetter = string.substr(0, 1).toLowerCase();
  }

  if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZeéèEÉÈàÀâÂâÄîÎïÏçÇùûôÔöÖ'.indexOf(firstLetter) === -1) {
    firstLetter = defaultLetter;
  }

  return firstLetter;
}

const ContactListLetter = ({ letter }) => (
  <Title><span className="m-contact-list__alpha-title">{letter}</span></Title>
);

ContactListLetter.propTypes = {
  letter: PropTypes.string.isRequired,
};
const ContactList = ({ contacts, sortView }) => {
  const altSortView = 'title';
  const letters = [];
  let firstLetter = null;
  contacts.map((contact) => {
    // assuming contact.title is NEVER empty or null
    const contactTitle = contact[sortView] ? contact[sortView] : contact[altSortView];
    if (getFirstLetter(contactTitle) !== firstLetter) {
      letters.push(getFirstLetter(contactTitle));
    }

    firstLetter = getFirstLetter(contactTitle);

    return false;
  });

  return (
    <div className="m-contact-list">
      {letters.map(letter =>
        <div key={uuidV1()} className="m-contact-list__group">
          <ContactListLetter
            letter={letter}
          />
          {contacts.map(contact => (
            contact[sortView] ?
            getFirstLetter(contact[sortView]) === letter &&
              <ContactItem
                contact={contact}
                key={contact.contact_id}
                sortView={sortView}
              />
              :
              getFirstLetter(contact[altSortView]) === letter &&
                <ContactItem
                  contact={contact}
                  key={contact.contact_id}
                  sortView={sortView}
                />
            ))}
        </div>
    )}
    </div>
  );
};

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sortView: PropTypes.oneOf([SORT_VIEW_GIVEN_NAME, SORT_VIEW_FAMILY_NAME]).isRequired,
};
ContactList.defaultProps = {
  sortView: 'given_name',
};


export default ContactList;
