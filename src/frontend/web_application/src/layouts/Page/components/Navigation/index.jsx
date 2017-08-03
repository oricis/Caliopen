import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslator } from '@gandi/react-translate';
import ApplicationSwitcher from './components/ApplicationSwitcher';
import Navbar, { NavbarItem } from './components/Navbar';
import StickyNavbar from './components/StickyNavBar';
import TabList from './components/TabList';
import SliderContainer from '../../../../components/ImportanceSliderContainer';
import Dropdown, { withDropdownControl } from '../../../../components/Dropdown';
import Button from '../../../../components/Button';
import Icon from '../../../../components/Icon';
import './style.scss';

const ToggleSliderButton = withDropdownControl(Button);

@withTranslator()
class Navigation extends PureComponent {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };

  render() {
    const { __ } = this.props;

    return (
      <Navbar className="l-navigation">
        <StickyNavbar
          className="l-navigation__wrapper hide-for-small-only"
          stickyClassName="l-navigation__wrapper--sticky"
        >
          <ApplicationSwitcher className="l-navigation__application-switcher" />
          <TabList className="l-navigation__tab-list" />
          <NavbarItem className="l-navigation__sliders-toggle">
            <ToggleSliderButton
              toggle="IL_navigation_slider_dropdown"
              title={__('navigation.actions.toggle-importance-level-slider')}
              className="l-navigation__sliders-toggle-button"
            >
              <Icon type="warning" />
            </ToggleSliderButton>
            <Dropdown
              id="IL_navigation_slider_dropdown"
              position="bottom"
              closeOnClick
              className="l-navigation__sliders-dropdown"
            >
              <SliderContainer vertical className="l-navigation__sliders-container" />
            </Dropdown>
          </NavbarItem>
        </StickyNavbar>
      </Navbar>
    );
  }
}

export default Navigation;
