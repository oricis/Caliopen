import React from 'react';
import PropTypes from 'prop-types';
import NavList, { ItemContent } from '../../components/NavList';
import MenuBar from '../../components/MenuBar';
import Link from '../../components/Link';

import './style.scss';

const Settings = ({ __, children }) => {
  const navLinks = [
    { title: __('settings.account'), to: '/settings/account', active: false },
    { title: __('settings.application'), to: '/settings/appplication', active: false },
    { title: __('settings.view'), to: '/settings/view', active: false },
    { title: __('settings.tags'), to: '/settings/tags', active: false },
    { title: __('settings.devices'), to: '/settings/devices', active: false },
    { title: __('settings.signatures'), to: '/settings/signatures', active: false },
  ];

  return (
    <div className="l-settings">
      <MenuBar>
        <NavList>
          {navLinks.map(link => (
            <ItemContent active={link.active} large key={link.title}>
              <Link noDecoration {...link}>{link.title}</Link>
            </ItemContent>
          ))}
        </NavList>
      </MenuBar>
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
