import React from 'react';
import ApplicationSwitcher from './components/ApplicationSwitcher';
import Navbar, { Tab } from './components/Navbar';
import StickyNavbar from './components/StickyNavBar';
import './style.scss';

const Navigation = () => (
  <Navbar className="l-navigation hide-for-small-only">
    <StickyNavbar className="l-navigation__wrapper" stickyClassName="l-navigation__wrapper--sticky">
      <Tab className="l-navigation__application-switcher" active>
        <ApplicationSwitcher />
      </Tab>
      <div className="l-navigation__tab-list">
        <tab-list />
      </div>
      <div className="l-navigation__sliders-toggle">
        <Tab last><sliders-container /></Tab>
      </div>
    </StickyNavbar>
  </Navbar>
);

export default Navigation;
