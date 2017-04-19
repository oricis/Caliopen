import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import configureStore from './store/configure-store';
import getRouterHistory from './services/router-history';

let devTools;

if (CALIOPEN_ENV === 'development') {
  devTools = window.devToolsExtension && window.devToolsExtension();
}

const store = configureStore({}, devTools);
const history = getRouterHistory();

const rootEl = document.getElementById('root');
ReactDOM.render(
  <AppContainer>
    <ConnectedRouter store={store} history={history}>
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
        <ConnectedRouter history={history}>
          <NextApp store={store} />
        </ConnectedRouter>
      </AppContainer>,
      rootEl
    );
  });
}
