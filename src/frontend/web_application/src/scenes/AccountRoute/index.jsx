import React from 'react';
import PropTypes from 'prop-types';
import { RouteWithSubRoutes } from '../../routes';
import Account from '../../layouts/Account';


const AccountRoute = ({ routes }) => (
  <Account>
    {routes.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
  </Account>
);

AccountRoute.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default AccountRoute;
