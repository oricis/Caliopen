let history;
export const getRouterHistory = () => {
  if (!history) {
    if (BUILD_TARGET === 'browser') {
      history = require('history').createBrowserHistory(); // eslint-disable-line
    }

    if (['cordova', 'electron'].indexOf(BUILD_TARGET) !== -1) {
      history = require('history').createHashHistory(); // eslint-disable-line
    }

    if (BUILD_TARGET === 'server') {
      history = require('history').createMemoryHistory(); // eslint-disable-line
    }
  }

  return history;
};
