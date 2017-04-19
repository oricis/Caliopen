let history;
function getRouterHistory() {
  if (!history) {
    if (BUILD_TARGET === 'browser') {
      history = require('history/createBrowserHistory').default(); // eslint-disable-line
    }

    if (['cordova', 'electron'].indexOf(BUILD_TARGET) !== -1) {
      history = require('history/createHashHistory').default(); // eslint-disable-line
    }

    if (BUILD_TARGET === 'server') {
      history = require('history/createMemoryHistory').default(); // eslint-disable-line
    }
  }

  return history;
}

export default getRouterHistory;
