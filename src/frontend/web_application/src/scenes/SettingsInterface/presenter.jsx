import React from 'react';
import PropTypes from 'prop-types';
import Section from '../../components/Section';
import InterfaceForm from './components/InterfaceForm';
import PresentationForm from './components/PresentationForm';

const SettingsInterface = ({ __ }) => (
  <div className="s-settings-interface">
    <Section title={__('settings.interface.title')}><InterfaceForm /></Section>
    <Section title={__('settings.presentation.title')}><PresentationForm /></Section>
  </div>
);

SettingsInterface.propTypes = {
  __: PropTypes.func.isRequired,
};

export default SettingsInterface;
