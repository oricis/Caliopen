const path = require('path');
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const template = fs.readFileSync(path.join(process.cwd(), 'template', 'index.html'), 'utf8');

const renderTemplate = (markup, assets) => {
  const stylesheets = assets.styles.reduce((str, url) => `${str}<link rel="stylesheet" href="${url}"></link>\n`, '');

  return [
    { key: '%HEAD%', value: stylesheets },
    { key: '%MARKUP%', value: markup },
    { key: '%BODY_SCRIPT%', value: '' },
  ].reduce((str, current) => str.replace(current.key, current.value), template);
};

/**
 * This engine uses react components, those are pre-compiled and given in the route argument e.g:
 *
 * `createEngine({ 'login.component': require('./Login').default })`
 *
 * the components are in-memory, a view path is not required. The express render method will work as
 * usually: `app.render('login.component', {})`
 */
const createEngine = (routes = {}, config) => {
  const assets = {
    styles: config.frontend.cssFiles,
  };

  const renderview = (viewName, options, cb) => {
    // XXX: cb is useless : not async, try catch also
    let markup;
    try {
      markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(routes[viewName], options)
      );
    } catch (e) {
      return cb(e);
    }

    return cb(null, renderTemplate(markup, assets));
  };

  return renderview;
};

module.exports = createEngine;
