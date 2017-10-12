import merge from 'lodash.merge';

let config = CALIOPEN_OPTIONS;

const initConfig = (cfg) => { config = merge(config, cfg); };
const getConfig = () => config;
const getAPIBaseUrl = () => {
  if (BUILD_TARGET === 'browser') {
    return '/api';
  }

  if (BUILD_TARGET === 'server') {
    const { protocol, hostname, port } = getConfig();

    return `${protocol}://${hostname}:${port}`;
  }

  // FIXME: (for cordova/electron) get from config (yaml -> json -> settings -> here)
  return 'http://notYetImplemented/api';
};


export {
  getAPIBaseUrl,
  initConfig,
  getConfig,
};
