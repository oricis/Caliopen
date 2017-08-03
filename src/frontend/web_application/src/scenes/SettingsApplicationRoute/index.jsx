import React from 'react';
import PropTypes from 'prop-types';
import { RouteWithSubRoutes } from '../../routes';
import SettingsApplication from '../SettingsApplication';


const DevicesRoute = ({ routes }) => (
  <SettingsApplication>
    {routes.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
  </SettingsApplication>
);

DevicesRoute.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default DevicesRoute;
