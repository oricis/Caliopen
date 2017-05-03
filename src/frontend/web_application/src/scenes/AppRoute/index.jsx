import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import Page from '../../layouts/Page';
import { RouteWithSubRoutes } from '../../routes';

const AppRoute = ({ routes }) => (
  <Page>
    <Switch>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </Switch>
  </Page>
);

AppRoute.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default AppRoute;
