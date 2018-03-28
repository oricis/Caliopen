import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import ApplicationSwitcher from './components/ApplicationSwitcher';
import Navbar, { NavbarItem } from './components/Navbar';
import StickyNavbar from './components/StickyNavBar';
import TabList from './components/TabList';
import TimelineFilterContainer from './components/TimelineFilterContainer';
import SliderContainer from '../ImportanceSliderContainer';
import { Icon, Dropdown, withDropdownControl, Button } from '../../../../components/';
import './style.scss';

const ToggleSliderButton = withDropdownControl(Button);

@withI18n()
class Navigation extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
  };

  render() {
    const { i18n } = this.props;

    return (
      <Navbar className="l-navigation">
        <StickyNavbar
          className="l-navigation__wrapper show-for-medium"
          stickyClassName="l-navigation__wrapper--sticky"
        >
          <ApplicationSwitcher className="l-navigation__application-switcher" />
          <TabList className="l-navigation__tab-list" />
          <NavbarItem className="l-navigation__sliders-toggle">
            <ToggleSliderButton
              toggleId="IL_navigation_slider_dropdown"
              title={i18n._('navigation.actions.toggle-importance-level-slider', { defaults: 'Toggle importance slider' })}
              className="l-navigation__sliders-toggle-button"
            >
              <Icon type="warning" />
            </ToggleSliderButton>
            <Dropdown
              id="IL_navigation_slider_dropdown"
              className="l-navigation__sliders-dropdown"
              closeOnClick="exceptSelf"
            >
              <SliderContainer vertical className="l-navigation__sliders-container" />
            </Dropdown>
          </NavbarItem>
          <NavbarItem className="l-navigation__timeline-filter-toggle">
            <TimelineFilterContainer />
          </NavbarItem>
        </StickyNavbar>
      </Navbar>
    );
  }
}

export default Navigation;
