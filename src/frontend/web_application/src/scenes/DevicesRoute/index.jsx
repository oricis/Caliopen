import React from 'react';
import PropTypes from 'prop-types';
import { RouteWithSubRoutes } from '../../routes';
import Devices from '../Devices';


const DevicesRoute = ({ routes }) => (
  <Devices>
    {routes.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
  </Devices>
);

DevicesRoute.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default DevicesRoute;
