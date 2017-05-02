const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Bootstrap = require('./components/Bootstrap').default;
const configureStore = require('../../src/store/configure-store').default;

const isDev = process.env.NODE_ENV === 'development';

const config = {
  styles: isDev ? ['/build/client.css'] : ['/assets/client.css'],
  scripts: isDev ? ['/build/bundle.js'] : ['/bundle.js'],
};
const template = fs.readFileSync(path.join(process.cwd(), 'template', 'index.html'), 'utf8');

/**
 * base html template
 */
function getMarkup({ store, assets, context, location }) {
  const markup = ReactDOMServer.renderToString(
    React.createElement(Bootstrap, {
      context, location, store,
    }));

  const initialState = store.getState();
  const scripts = assets.scripts.reduce((str, url) => `${str}<script src="${url}"></script>\n`, '');
  const stylesheets = assets.styles.reduce((str, url) => `${str}<link rel="stylesheet" href="${url}"></link>\n`, '');

  return [
    { key: '%HEAD%', value: `<script>window.__STORE__ = ${JSON.stringify(initialState)};</script>\n${stylesheets}` },
    { key: '%MARKUP%', value: markup },
    { key: '%BODY_SCRIPT%', value: scripts },
  ].reduce((str, current) => str.replace(current.key, current.value), template);
}

function applyUserLocaleToGlobal(req) {
  global.USER_LOCALE = req.cookies.locale || req.locale;
}

module.exports = (req, res) => {
  applyUserLocaleToGlobal(req);

  // XXX: prefetch
  const initialState = {
  };

  const store = configureStore(initialState);
  const context = {};
  const html = getMarkup({ store, assets: config, location: { pathname: req.url }, context });

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
