import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import Page from '../../layouts/Page';
import enableI18n from '../../services/i18n';
import { RouteWithSubRoutes } from '../../routes';

const I18nPage = enableI18n(Page);

const AppRoute = ({ routes }) => (
  <I18nPage>
    <Switch>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </Switch>
  </I18nPage>
);

AppRoute.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default AppRoute;
