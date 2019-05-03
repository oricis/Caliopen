import React from 'react';
import ReactDOMServer from 'react-dom/server';
import DocumentTitle from 'react-document-title';
import serialize from 'serialize-javascript';
import Bootstrap from './components/Bootstrap';
import configureStore from '../../src/store/configure-store';
import { getUserLocales } from '../../src/modules/i18n';
import { getDefaultSettings } from '../../src/modules/settings';
import template from '../../dist/server/template.html';
import { getConfig } from '../config';
import { initialState as initialStateSettings } from '../../src/store/modules/settings';

/**
 * base html template
 */
function getMarkup({ store, context, location }) {
  try {
    const {
      protocol, hostname, port, maxBodySize,
    } = getConfig();
    const config = { protocol, hostname, port };
    const markup = ReactDOMServer.renderToString(React.createElement(Bootstrap, {
      context, location, store, config,
    }));
    const documentTitle = DocumentTitle.rewind();
    const initialState = store.getState();

    return [
      { key: '</title>', value: `${documentTitle}</title>` },
      { key: '</head>', value: `<script>window.__STORE__ = ${serialize(initialState)};window.__INSTANCE_CONFIG__ = ${serialize({ hostname, maxBodySize })}</script></head>` },
      { key: '%MARKUP%', value: markup },
    ].reduce((str, current) => str.replace(current.key, current.value), template);
  } catch (e) {
    console.error('Unable to render markup:', e);

    throw e;
  }
}

function applyUserLocaleToGlobal(req) {
  global.USER_LOCALE = req.locale;
}

export default (req, res) => {
  applyUserLocaleToGlobal(req);
  const initialState = {
    settings: {
      ...initialStateSettings,
      settings: getDefaultSettings(getUserLocales()[0]),
    },
    instanceConfig: getConfig(),
  };

  const store = configureStore(initialState);
  const context = {};

  const html = getMarkup({ store, location: req.url, context });

  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    });
    res.end();
  } else {
    res.write(html);
    res.end();
  }
};
