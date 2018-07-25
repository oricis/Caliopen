import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tab from '../Tab';
import HorizontalScroll from '../../../Page/components/Navigation/components/Navbar/components/HorizontalScroll';
import { NavbarItem } from '../../../Page/components/Navigation/components/Navbar';
import { Button, Icon } from '../../../../components/';

import './style.scss';

class Navigation extends Component {
  static propTypes = {
    className: PropTypes.string,
    isSticky: PropTypes.bool,
    requestTabs: PropTypes.func.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.shape({})),
  };
  static defaultProps = {
    className: undefined,
    isSticky: false,
    tabs: undefined,
  };

  componentDidMount() {
    this.props.requestTabs();
  }
  getTabIdentifier = ({ pathname, search, hash }) => `${pathname}${search}${hash}`;

  render() {
    const { tabs, className, isSticky } = this.props;
    const isLast = tab => tabs.indexOf(tab) === (tabs.length - 1);

    return (
      <div className={classnames('l-navigation', className)}>
        <HorizontalScroll subscribedState={tabs}>
          {tabs.map(tab => (
            <Tab key={this.getTabIdentifier(tab)} tab={tab} last={isLast(tab)} />
          ))}
          <NavbarItem className={classnames('l-navigation__compose-item', { 'l-navigation__compose-item--sticky': isSticky })}>
            <Button shape="plain" className="l-navigation__compose-btn"><Icon type="pencil" /> <Icon type="plus" /></Button>
          </NavbarItem>
        </HorizontalScroll>
      </div>
    );
  }
}

export default Navigation;
