import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from './scenes/Auth';
import DiscussionList from './scenes/DiscussionList';
import AppRoute from './scenes/AppRoute';
import SettingsRoute from './scenes/SettingsRoute';
import DevicesRoute from './scenes/DevicesRoute';
import MessageList from './scenes/MessageList';
import ContactBook from './scenes/ContactBook';
import Account from './scenes/Account';
import Tags from './scenes/Tags';
import { Device } from './scenes/Devices';

export const getRouteconfig = () => [
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
        routes: [
          {
            path: '/settings/account',
            component: Account,
          },
          {
            path: '/settings/tags',
            component: Tags,
          },
          {
            path: '/settings/devices',
            component: DevicesRoute,
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

const Routes = () => (
  <Switch>
    {getRouteconfig().map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
  </Switch>
);

export default Routes;
