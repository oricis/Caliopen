const getAPIBaseUrl = () => {
  if (BUILD_TARGET === 'browser') {
    return '/api';
  }

  if (BUILD_TARGET === 'server') {
    // FIXME: get from config (yaml -> json -> here)
    return 'http://localhost:4001/api';
  }

  // FIXME: (for cordova/electron) get from config (yaml -> json -> settings -> here)
  return 'http://notYetImplemented/api';
};

export default {
  getAPIBaseUrl,
};
