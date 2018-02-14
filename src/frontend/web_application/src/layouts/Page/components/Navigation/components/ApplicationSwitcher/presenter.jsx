import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { ItemLink, NavbarItem } from '../Navbar';
import { Link, Button, Icon, Dropdown, withDropdownControl, VerticalMenu, VerticalMenuItem } from '../../../../../../components/';
import { getLabels } from '../../../../../../services/application-manager';
import './style.scss';

const DropdownControl = withDropdownControl(Button);

class ApplicationSwitcher extends Component {
  static propTypes = {
    applications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    currentApplication: PropTypes.shape({
      route: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    isactive: PropTypes.bool.isRequired,
    onClickApp: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  state = { isDropdownOpen: false };

  handleDropdownToggle = (isDropdownOpen) => {
    this.setState({ isDropdownOpen });
  };

  render() {
    const { i18n, onClickApp, isactive } = this.props;
    const applicationLabels = getLabels(i18n);

    return (
      <NavbarItem
        className="m-application-switcher"
        active={isactive}
        contentChildren={(
          <ItemLink
            to={this.props.currentApplication.route}
            onClick={() => onClickApp(this.props.currentApplication)}
          >
            <Icon className="m-application-switcher__icon" type={this.props.currentApplication.icon} />
            {applicationLabels[this.props.currentApplication.name]}
          </ItemLink>
        )}
        actionChildren={(
          <DropdownControl
            toggleId="co-application-switcher"
            className="m-application-switcher__toggler"
          >
            <span className="show-for-sr"><Trans id="application_switcher.action.choose">Choose</Trans></span>
            <Icon type={this.state.isDropdownOpen ? 'caret-up' : 'caret-down'} />
          </DropdownControl>
        )}
      >
        <Dropdown
          id="co-application-switcher"
          closeOnClick="all"
          alignRight
          className="m-application-switcher__dropdown"
          onToggle={this.handleDropdownToggle}
        >
          <VerticalMenu>
            {
              this.props.applications.filter(app => app !== this.props.currentApplication)
              .map(application => (
                <VerticalMenuItem
                  key={application.route}
                  className="m-application-switcher__dropdown-item"
                >
                  <Link to={application.route} button expanded>
                    <Icon type={application.icon} />
                    {' '}
                    {applicationLabels[application.name]}
                  </Link>
                </VerticalMenuItem>
              ))
            }
          </VerticalMenu>
        </Dropdown>
      </NavbarItem>
    );
  }
}

export default ApplicationSwitcher;
