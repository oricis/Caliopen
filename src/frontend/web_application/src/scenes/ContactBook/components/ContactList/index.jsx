import React, { PropTypes } from 'react';
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
  letter: PropTypes.string,
};
const ContactList = ({ contacts, sortView }) => {
  const letters = [];
  let firstLetter = null;
  contacts.map((c) => {
    const contactTitle = getFirstLetter(c.contact[sortView]);
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
            {contacts.map(c =>
              getFirstLetter(c.contact[sortView]) === letter &&
                <ContactItem
                  contact={c.contact}
                  key={c.contact.contact_id}
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
  contacts: PropTypes.arrayOf(PropTypes.shape({})),
  sortView: PropTypes.string,
};


export default ContactList;
