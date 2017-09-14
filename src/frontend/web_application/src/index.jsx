import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import PiwikReactRouter from 'piwik-react-router';
import App from './App';
import configureStore from './store/configure-store';
import getRouterHistory from './services/router-history';
import { getUserLocales } from './services/i18n';
import getDefaultSettings from './services/settings';

const piwik = PiwikReactRouter({
  url: 'https://piwik.caliopen.org/analytics',
  siteId: 6,
});

let devTools;

if (CALIOPEN_ENV === 'development') {
  devTools = window.devToolsExtension && window.devToolsExtension();
}

const locales = getUserLocales();
const settings = getDefaultSettings(locales[0]);

const store = configureStore({
  settings: {
    settings,
  },
}, devTools);
const history = getRouterHistory();

const rootEl = document.getElementById('root');
ReactDOM.render(
  <AppContainer>
    <ConnectedRouter store={store} history={piwik.connectToHistory(history)}>
      <App store={store} />
    </ConnectedRouter>
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./App', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    // eslint-disable-next-line global-require
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
        <ConnectedRouter history={piwik.connectToHistory(history)}>
          <NextApp store={store} />
        </ConnectedRouter>
      </AppContainer>,
      rootEl
    );
  });
}
