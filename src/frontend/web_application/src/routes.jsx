import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { withTranslator } from '@gandi/react-translate';
import Account from './scenes/Contact';
import Auth from './scenes/Auth';
import DiscussionList from './scenes/DiscussionList';
import AppRoute from './scenes/AppRoute';
import SettingsRoute from './scenes/SettingsRoute';
import DevicesRoute from './scenes/DevicesRoute';
import MessageList from './scenes/MessageList';
import ContactBook from './scenes/ContactBook';
import Tags from './scenes/Tags';
import { Device } from './scenes/Devices';

export const getRouteConfig = ({ __ }) => [
  {
    path: '/auth',
    component: Auth,
    app: 'auth',
  },
  {
    path: '/',
    component: AppRoute,
    routes: [
      {
        path: '/',
        exact: true,
        component: DiscussionList,
        app: 'discussion',
      },
      {
        path: '/discussions/:discussionId',
        component: MessageList,
        app: 'discussion',
      },
      {
        path: '/contacts',
        component: ContactBook,
        app: 'contact',
      },
      {
        path: '/settings',
        component: SettingsRoute,
        app: 'settings',
        label: __('settings.route.label.default'),
        routes: [
          {
            path: '/settings/account',
            component: Account,
            label: __('settings.route.label.account'),
          },
          {
            path: '/settings/tags',
            component: Tags,
            label: __('settings.route.label.tags'),
          },
          {
            path: '/settings/devices',
            component: DevicesRoute,
            label: __('settings.route.label.devices'),
            routes: [
              {
                path: '/settings/devices/:deviceId',
                component: Device,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const flattenRouteConfig = routes => routes.reduce((acc, route) => {
  const { routes: subRoutes, ...routeConfig } = route;
  let flattened = [...acc, routeConfig];
  if (subRoutes) {
    flattened = [...flattened, ...flattenRouteConfig(subRoutes)];
  }

  return flattened;
}, []);

export const RouteWithSubRoutes = route => (
  <Route
    path={route.path} render={props => (
      <route.component {...props} routes={route.routes} />
    )}
  />
);

const Routes = ({ __ }) => (
  <Switch>
    {getRouteConfig({ __ }).map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
  </Switch>
);
Routes.propTypes = {
  __: PropTypes.func.isRequired,
};

export default withTranslator()(Routes);
