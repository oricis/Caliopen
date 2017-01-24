import React, { PropTypes } from 'react';
import ContactAvatarLetter from '../../../ContactAvatarLetter';
import Link from '../../../Link';
import Icon from '../../../Icon';
import VerticalMenu, { VerticalMenuItem } from '../../../VerticalMenu';
import './style.scss';

const NavigationAlt = ({ user, currentApplication, applications, __ }) => (
  <div className="l-nav-alt">
    <div className="l-nav-alt__user">
      <div className="l-nav-alt__avatar">
        {user && <ContactAvatarLetter contact={user.contact} modifiers={{ size: 'small' }} />}
      </div>
      <div className="l-nav-alt__user-name">
        { user && (
          <div>
            <div>{user.contact.title}</div>
            <div>{user.contact.emails[0] && user.contact.emails[0].address}</div>
          </div>
        )}
      </div>
    </div>
    <VerticalMenu className="l-nav-alt__menu">
      {
        applications.map((application, key) => (
          <VerticalMenuItem key={key}>
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
    <tab-list-alt />
    <VerticalMenu className="l-nav-alt__menu">
      <VerticalMenuItem>
        <Link to="/auth/logout" button expanded>
          {__('header.menu.signout')}
        </Link>
      </VerticalMenuItem>
    </VerticalMenu>
  </div>
);

NavigationAlt.propTypes = {
  user: PropTypes.shape({}),
  applications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentApplication: PropTypes.shape({}).isRequired,
  __: PropTypes.func.isRequired,
};

export default NavigationAlt;
