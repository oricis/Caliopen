import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect, matchPath } from 'react-router-dom';
import { RouteWithSubRoutes } from '../../routes';
import SettingsApplication from '../../layouts/SettingsApplication';

// TODO refactor this to a LayoutRoute component
class SettingsApplicationRoute extends PureComponent {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    location: PropTypes.shape({}).isRequired,
  };

  render() {
    const { routes, location } = this.props;
    const redirect = (location && matchPath(location.pathname, {
      path: '/settings/application',
      exact: true,
    }) && (<Redirect to="/settings/application/interface" />)) || null;

    return (
      <SettingsApplication>
        {redirect}
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </SettingsApplication>
    );
  }
}

export default SettingsApplicationRoute;
