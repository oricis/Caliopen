import React from 'react';
import PropTypes from 'prop-types';
import Section from '../../components/Section';
import ContactsForm from './components/ContactsForm';

const fakeContactsSettings = {
  display: 'Lastname, Firstname',
  order: '',
  contact_format: '',
  adress_format: 'US',
  phone_format: '+33.XXXXXXXXXX',
  vcard_format: '4.0',
  vcard_encoding: '',
};

const SettingsContacts = ({ __ }) => (
  <Section title={__('settings.contacts.title')}>
    <ContactsForm settings={fakeContactsSettings} onSubmit={str => str} />
  </Section>
);

SettingsContacts.propTypes = {
  __: PropTypes.func.isRequired,
};

export default SettingsContacts;
