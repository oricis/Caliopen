import React from 'react';
import PropTypes from 'prop-types';
import NavList, { ItemContent } from '../../components/NavList';
import Link from '../../components/Link';

import './style.scss';

const SettingsApplication = ({ __, children }) => {
  const navLinks = [
    { title: __('settings.application.menu.interface'), to: '/settings/application/interface' },
    { title: __('settings.application.menu.contacts'), to: '/settings/application/contacts' },
    { title: __('settings.application.menu.notifications'), to: '/settings/application/notifications' },
  ];

  return (
    <div className="s-settings-application">
      {navLinks &&
        <NavList dir="vertical" className="s-settings-application__menu">
          {navLinks.map(link => (
            <ItemContent
              active={false}
              large
              key={link.title}
            >
              <Link
                noDecoration
                {...link}
              >{link.title}</Link>
            </ItemContent>
          ))}
        </NavList>
      }
      <div className="s-settings-application__panel">{children}</div>
    </div>
  );
};


SettingsApplication.propTypes = {
  children: PropTypes.node,
  __: PropTypes.func.isRequired,
};

SettingsApplication.defaultProps = {
  children: null,
};

export default SettingsApplication;
