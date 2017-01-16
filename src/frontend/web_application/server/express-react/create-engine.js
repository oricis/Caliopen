const path = require('path');
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const renderTemplate = (markup) => {
  const tpl = fs.readFileSync(path.join(process.cwd(), 'template', 'index.html'), 'utf8');

  return [
    { key: '%HEAD%', value: '' },
    { key: '%MARKUP%', value: markup },
    { key: '%BODY_SCRIPT%', value: '' },
  ].reduce((str, current) => str.replace(current.key, current.value), tpl);
};

/**
 * This engine uses react components, those are pre-compiled and given in the route argument e.g:
 *
 * `createEngine({ 'login.component': require('./Login').default })`
 *
 * the components are in-memory, a view path is not required. The express render method will work as
 * usually: `app.render('login.component', {})`
 */
const createEngine = (routes = {}) => {
  const renderview = (viewName, options, cb) => {
    let markup;
    try {
      markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(routes[viewName], options)
      );
    } catch (e) {
      return cb(e);
    }

    return cb(null, renderTemplate(markup));
  };

  return renderview;
};

module.exports = createEngine;
