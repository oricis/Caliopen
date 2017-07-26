import React from 'react';
import PropTypes from 'prop-types';
import MenuBar from '../../components/MenuBar';

const Account = ({ __, children }) => {
  const navLinks = [
    { title: __('account.profile'), to: '/account/profile' },
    { title: __('account.privacy'), to: '/account/privacy' },
    { title: __('account.security'), to: '/account/security' },
  ];

  return (
    <div className="l-account">
      <MenuBar
        className="l-account__menu-bar"
        navLinks={navLinks}
      />
      <div className="l-account__panel">
        {children}
      </div>
    </div>
  );
};

Account.propTypes = {
  children: PropTypes.node,
  __: PropTypes.func.isRequired,
};

Account.defaultProps = {
  children: null,
};

export default Account;
