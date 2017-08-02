import React from 'react';
import PropTypes from 'prop-types';
import MenuBar from '../../components/MenuBar';

const User = ({ __, children }) => {
  const navLinks = [
    { title: __('user.profile'), to: '/user/profile' },
    { title: __('user.privacy'), to: '/user/privacy' },
    { title: __('user.security'), to: '/user/security' },
  ];

  return (
    <div className="l-user">
      <MenuBar
        className="l-user__menu-bar"
        navLinks={navLinks}
      />
      <div className="l-user__panel">
        {children}
      </div>
    </div>
  );
};

User.propTypes = {
  children: PropTypes.node,
  __: PropTypes.func.isRequired,
};

User.defaultProps = {
  children: null,
};

export default User;
