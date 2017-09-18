import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Title from '../../../../components/Title';
import ContactItem from '../../components/ContactItem';
import { DEFAULT_SORT_DIR } from '../../presenter';

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

class ContactList extends PureComponent {
  static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    sortDir: PropTypes.string,
  };
  static defaultProps = {
    sortDir: DEFAULT_SORT_DIR,
  };

  render() {
    const { contacts, sortDir } = this.props;
    const contactsGroupedByLetter = contacts.reduce((acc, contact) => {
      const firstLetter = getFirstLetter(contact.title);

      return {
        ...acc,
        [firstLetter]: [
          ...(acc[firstLetter] || []),
          contact,
        ],
      };
    }, {});
    const firstLetters = Object.keys(contactsGroupedByLetter).sort((a, b) => {
      switch (sortDir) {
        default:
        case 'ASC':
          return (a || '').localeCompare(b);
        case 'DESC':
          return (b || '').localeCompare(a);
      }
    });

    return (
      <div className="m-contact-list">
        {firstLetters.map(letter => (
          <div key={letter} className="m-contact-list__group">
            <ContactListLetter letter={letter} />
            {contactsGroupedByLetter[letter].map(contact => (
              <ContactItem contact={contact} key={contact.contact_id} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default ContactList;
