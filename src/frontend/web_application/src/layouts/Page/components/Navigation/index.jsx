import React from 'react';
import ApplicationSwitcher from './components/ApplicationSwitcher';
import Navbar, { NavbarItem } from './components/Navbar';
import StickyNavbar from './components/StickyNavBar';
import TabList from './components/TabList';
import './style.scss';

const Navigation = () => (
  <Navbar className="l-navigation">
    <StickyNavbar
      className="l-navigation__wrapper hide-for-small-only"
      stickyClassName="l-navigation__wrapper--sticky"
    >
      <ApplicationSwitcher className="l-navigation__application-switcher" />
      <TabList className="l-navigation__tab-list" />
      <NavbarItem className="l-navigation__sliders-toggle" last><sliders-container /></NavbarItem>
    </StickyNavbar>
  </Navbar>
);

export default Navigation;
