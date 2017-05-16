const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Bootstrap = require('./components/Bootstrap').default;
const configureStore = require('../../src/store/configure-store').default;

const template = require('../../dist/server/template.html');

/**
 * base html template
 */
function getMarkup({ store, context, location }) {
  const markup = ReactDOMServer.renderToString(
    React.createElement(Bootstrap, {
      context, location, store,
    }));

  const initialState = store.getState();

  return [
    { key: '</head>', value: `<script>window.__STORE__ = ${JSON.stringify(initialState)};</script></head>` },
    { key: '%MARKUP%', value: markup },
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
  const html = getMarkup({ store, location: { pathname: req.url }, context });

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
