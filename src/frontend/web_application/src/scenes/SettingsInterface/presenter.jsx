import React from 'react';
import PropTypes from 'prop-types';
import Section from '../../components/Section';
import InterfaceForm from './components/InterfaceForm';
// import PresentationForm from './components/PresentationForm';

// const fakePresentationSettings = {
//   show_avatar_inbox: true,
//   show_unread_msg_bolder: false,
//   show_recent_msg_on_top: false,
//   show_msg_in_conversation: true,
//   preview_inbox: '1 line',
// };

const SettingsInterface = ({ __ }) => (
  <div className="s-settings-interface">
    <Section title={__('settings.interface.title')}><InterfaceForm /></Section>
    {/* <Section title={__('settings.presentation.title')}>
      <PresentationForm settings={fakePresentationSettings} onSubmit={str => str} />
    </Section> */}
  </div>
);

SettingsInterface.propTypes = {
  __: PropTypes.func.isRequired,
};

export default SettingsInterface;
