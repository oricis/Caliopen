import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import Page from '../../layouts/Page';
import { RouteWithSubRoutes } from '../../routes';
import SettingsProvider from '../../components/SettingsProvider';

class AppRoute extends PureComponent {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  render() {
    const { routes } = this.props;

    return (
      <SettingsProvider>
        <Page>
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </Page>
      </SettingsProvider>
    );
  }
}

export default AppRoute;
