const getAPIBaseUrl = () => {
  if (BUILD_TARGET === 'browser') {
    return '/api';
  }

  return 'http://notYetImplemented/api';
};

export default {
  getAPIBaseUrl,
};
