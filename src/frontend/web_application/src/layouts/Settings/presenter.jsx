import React from 'react';
import PropTypes from 'prop-types';
import MenuBar from '../../components/MenuBar';

const Settings = ({ __, children }) => {
  const navLinks = [
    { title: __('settings.identities'), to: '/settings/identities' },
    { title: __('settings.application'), to: '/settings/application/interface' },
    { title: __('settings.tags'), to: '/settings/tags' },
    { title: __('settings.devices'), to: '/settings/devices' },
    { title: __('settings.signatures'), to: '/settings/signatures' },
  ];

  return (
    <div className="l-settings">
      <MenuBar className="l-settings__menu-bar" navLinks={navLinks} />
      <div className="l-settings__panel">{children}</div>
    </div>
  );
};

Settings.propTypes = {
  children: PropTypes.node,
  __: PropTypes.func.isRequired,
};

Settings.defaultProps = {
  children: null,
};

export default Settings;
