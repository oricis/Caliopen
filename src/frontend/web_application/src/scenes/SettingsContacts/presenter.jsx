import React from 'react';
import PropTypes from 'prop-types';
import Section from '../../components/Section';
import ContactsForm from '../../components/ContactsForm';

const fakeContactsSettings = {
  sort: null,
  order: null,
  format: null,
  adress_format: null,
  phone_format: null,
  vcard_format: null,
  vcard_encoding: null,
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
