import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';

const MenuBar = ({ className, children }) => {
  const menuBarClassName = classnames(
    'm-menu-bar',
    className,
  );

  return <div className={menuBarClassName}>{children}</div>;
};

MenuBar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

MenuBar.defaultProps = {
  className: null,
  children: null,
};

export default MenuBar;
