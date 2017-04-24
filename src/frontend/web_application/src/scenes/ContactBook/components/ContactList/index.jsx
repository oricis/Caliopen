import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import BlockList from '../../../../components/BlockList';
import Title from '../../../../components/Title';
import ContactItem from './components/ContactItem';
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
  const letters = [];
  let firstLetter = null;
  contacts.map((contact) => {
    const contactTitle = getFirstLetter(contact[sortView]);
    if (contactTitle !== firstLetter) {
      letters.push(getFirstLetter(contactTitle));
    }

    firstLetter = getFirstLetter(contactTitle);

    return false;
  });

  return (
    <div className="m-contact-list">
      {letters.map(letter =>
        <div key={uuidV1()}>
          <ContactListLetter
            letter={letter}
          />
          <BlockList className="m-contact-list__group">
            {contacts.map(contact =>
              getFirstLetter(contact[sortView]) === letter &&
                <ContactItem
                  contact={contact}
                  key={contact.contact_id}
                  sortView={sortView}
                />
            )}
          </BlockList>
        </div>
    )}
    </div>
  );
};

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sortView: PropTypes.string,
};
ContactList.defaultProps = {
  sortView: 'title',
};


export default ContactList;
