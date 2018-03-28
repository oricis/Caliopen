import merge from 'lodash.merge';

let config = CALIOPEN_OPTIONS;

const initConfig = (cfg) => { config = merge(config, cfg); };
const getConfig = () => config;
const getBaseUrl = () => {
  if (BUILD_TARGET === 'browser') {
    return '';
  }

  if (BUILD_TARGET === 'server') {
    const { protocol, hostname, port } = getConfig();

    return `${protocol}://${hostname}:${port}`;
  }

  // FIXME: (for cordova/electron) get from config (yaml -> json -> settings -> here)
  return 'http://notYetImplemented/api';
};
const getAPIBaseUrl = () => `${getBaseUrl()}/api`;

const getMaxSize = () => {
  const { maxBodySize } = getConfig();
  const numberSize = maxBodySize.toLowerCase()
    .replace('kb', '000')
    .replace('mb', '000000');

  return Number(numberSize);
};

export {
  getBaseUrl,
  getAPIBaseUrl,
  initConfig,
  getConfig,
  getMaxSize,
};
