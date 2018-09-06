import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Title, Link } from '../../../../components/';
import ContactItem from '../ContactItem';
import { DEFAULT_SORT_DIR } from '../../presenter';
import { getFirstLetter, formatName, getContactTitle } from '../../../../services/contact';

import './style.scss';

const ALPHA = '#abcdefghijklmnopqrstuvwxyz';

class ContactList extends PureComponent {
  static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    contactDisplayOrder: PropTypes.string.isRequired,
    contactDisplayFormat: PropTypes.string.isRequired,
    sortDir: PropTypes.string,
  };
  static defaultProps = {
    sortDir: DEFAULT_SORT_DIR,
  };

  render() {
    const {
      contacts, sortDir, contactDisplayOrder, contactDisplayFormat: format,
    } = this.props;
    const contactsGroupedByLetter = contacts
      .sort((a, b) => (a[contactDisplayOrder] || getContactTitle(a))
        .localeCompare(b[contactDisplayOrder] || getContactTitle(b)))
      .reduce((acc, contact) => {
        const firstLetter =
          getFirstLetter(contact[contactDisplayOrder] || formatName({ contact, format }));

        return {
          ...acc,
          [firstLetter]: [
            ...(acc[firstLetter] || []),
            contact,
          ],
        };
      }, {});
    const firstLetters = ALPHA.split('').sort((a, b) => {
      switch (sortDir) {
        default:
        case 'ASC':
          return (a || '').localeCompare(b);
        case 'DESC':
          return (b || '').localeCompare(a);
      }
    });
    const firstLettersWithContacts = Object.keys(contactsGroupedByLetter);

    return (
      <div className="m-contact-list">
        <div className="m-contact-list__nav">
          {firstLetters.map(letter => (
            <Link
              href={`#letter-${letter}`}
              className={classnames('m-contact-list__alpha-letter', { 'm-contact-list__alpha-letter--active': firstLettersWithContacts.includes(letter) })}
              key={letter}
            >
              {letter}
            </Link>
          ))}
        </div>
        <div className="m-contact-list__list">
          {firstLetters.map(letter => (
            contactsGroupedByLetter[letter] && (
              <div key={letter} className="m-contact-list__group">
                <Title className="m-contact-list__alpha-title" id={`letter-${letter}`}>{letter}</Title>
                {contactsGroupedByLetter[letter].map(contact => (
                  <ContactItem className="m-contact-list__contact" contact={contact} key={contact.contact_id} />
                ))}
              </div>
            )
          ))}
        </div>
      </div>
    );
  }
}

export default ContactList;
