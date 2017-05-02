import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ItemLink from './components/ItemLink';
import ItemButton from './components/ItemButton';
import Tab from './components/Tab';
import NavbarItem from './components/NavbarItem';
import HorizontalScroll from './components/HorizontalScroll';

const Navbar = ({ className, ...props }) => {
  const navbarProps = {
    ...props,
    className: classnames(className),
  };

  return (
    <div {...navbarProps} />
  );
};

Navbar.propTypes = {
  className: PropTypes.string,
};
Navbar.defaultProps = {
  className: undefined,
};

export default Navbar;
export { ItemLink, ItemButton, Tab, NavbarItem, HorizontalScroll };
