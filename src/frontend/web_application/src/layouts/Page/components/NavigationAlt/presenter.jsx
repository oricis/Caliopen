import React from 'react';
import PropTypes from 'prop-types';
import ContactAvatarLetter from '../../../../components/ContactAvatarLetter';
import Link from '../../../../components/Link';
import Icon from '../../../../components/Icon';
import VerticalMenu, { VerticalMenuItem } from '../../../../components/VerticalMenu';
import TabList from './components/TabList';
import './style.scss';

const NavigationAlt = ({ user, currentApplication, applications, __ }) => {
  const emailAddress = user && user.contact && user.contact.emails &&
    user.contact.emails.find(email => email.is_primary);

  return (
    <div className="l-nav-alt">
      <div className="l-nav-alt__user">
        <div className="l-nav-alt__avatar">
          {user && user.contact && <ContactAvatarLetter contact={user.contact} modifiers={{ size: 'small' }} />}
        </div>
        <div className="l-nav-alt__user-name">
          <div>{user && user.name}</div>
          {
            (emailAddress !== undefined && (<div>{emailAddress}</div>)) ||
            (<div className="l-nav-alt__no-primary-email">{__('header.menu.no_primary_email')}</div>)
          }
        </div>
      </div>
      <VerticalMenu className="l-nav-alt__menu">
        {
          applications.map(application => (
            <VerticalMenuItem key={application.name}>
              <Link
                to={application.route}
                button
                expanded
                active={currentApplication === application}
              >
                <Icon type={application.icon} /> {__(`header.menu.${application.name}`)}
              </Link>
            </VerticalMenuItem>
          ))
        }
      </VerticalMenu>
      <TabList />
      <VerticalMenu className="l-nav-alt__menu">
        <VerticalMenuItem>
          <Link to="/settings/account" button expanded>
            {__('header.menu.account')}
          </Link>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <Link to="/settings/devices" button expanded>
            {__('header.menu.settings')}
          </Link>
        </VerticalMenuItem>
        <VerticalMenuItem>
          <Link to="/auth/signout" button expanded>
            {__('header.menu.signout')}
          </Link>
        </VerticalMenuItem>
      </VerticalMenu>
    </div>
  );
};

NavigationAlt.propTypes = {
  user: PropTypes.shape({}),
  applications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentApplication: PropTypes.shape({}).isRequired,
  __: PropTypes.func.isRequired,
};
NavigationAlt.defaultProps = {
  user: undefined,
};

export default NavigationAlt;
