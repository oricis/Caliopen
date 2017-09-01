import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../../components/Link';
import Icon from '../../../../components/Icon';
import VerticalMenu, { VerticalMenuItem } from '../../../../components/VerticalMenu';
import TabList from './components/TabList';
import SliderContainer from '../../../../components/ImportanceSliderContainer';
import UserInfo from '../UserInfo';
import './style.scss';

const NavigationAlt = ({ currentApplication, applications, __ }) => (
  <div className="l-nav-alt">
    <UserInfo className="l-nav-alt__user" />
    <VerticalMenu className="l-nav-alt__menu">
      {
        applications.map(application => (
          <VerticalMenuItem key={application.name}>
            <Link
              to={application.route}
              button
              expanded
              active={currentApplication === application}
              data-toggle="left_off_canvas"
            >
              <Icon type={application.icon} /> {__(`header.menu.${application.name}`)}
            </Link>
          </VerticalMenuItem>
        ))
      }
    </VerticalMenu>
    <TabList />
    <VerticalMenu className="l-nav-alt__menu">
      <VerticalMenuItem className="l-nav-alt__importance-slider">
        <Icon type="warning" className="l-nav-alt__importance-slider-icon" />
        <SliderContainer className="l-nav-alt__slider" />
      </VerticalMenuItem>
    </VerticalMenu>
    <VerticalMenu className="l-nav-alt__menu">
      <VerticalMenuItem>
        <Link to="/user/profile" button expanded data-toggle="left_off_canvas">
          {__('header.menu.account')}
        </Link>
      </VerticalMenuItem>
      <VerticalMenuItem>
        <Link to="/settings/identities" button expanded data-toggle="left_off_canvas">
          {__('header.menu.settings')}
        </Link>
      </VerticalMenuItem>
      <VerticalMenuItem>
        <Link to="/auth/signout" button expanded data-toggle="left_off_canvas">
          {__('header.menu.signout')}
        </Link>
      </VerticalMenuItem>
    </VerticalMenu>
  </div>
);

NavigationAlt.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentApplication: PropTypes.shape({}).isRequired,
  __: PropTypes.func.isRequired,
};

export default NavigationAlt;
