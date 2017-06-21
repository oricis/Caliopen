import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import PiwikReactRouter from 'piwik-react-router';
import { v1 as uuidv1 } from 'uuid';
import App from './App';
import configureStore from './store/configure-store';
import getRouterHistory from './services/router-history';
import { getLocale } from './services/i18n';

const piwik = PiwikReactRouter({
  url: 'https://piwik.caliopen.org/anaytics',
  siteId: 1,
  userId: uuidv1(), //userId can be username, email adress or uuid
});

let devTools;

if (CALIOPEN_ENV === 'development') {
  devTools = window.devToolsExtension && window.devToolsExtension();
}

const locale = getLocale();
const store = configureStore({
  i18n: {
    locale,
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
