import React from 'react';
import PropTypes from 'prop-types';
import { RouteWithSubRoutes } from '../../routes';
import Settings from '../../layouts/Settings';


const SettingsRoute = ({ routes }) => (
  <Settings>
    {routes.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
  </Settings>
);

SettingsRoute.propTypes = {
  routes: PropTypes.arrayOf({}).isRequired,
};

export default SettingsRoute;
