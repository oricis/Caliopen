import CrappyURLSearchParams from './CrappyURLSearchParams';

let nodeURLSearchParams;

if (BUILD_TARGET === 'server') {
  // eslint-disable-next-line global-require
  nodeURLSearchParams = require('url').URLSearchParams;
}

export const URLSearchParams = global.URLSearchParams ||
  nodeURLSearchParams || CrappyURLSearchParams;
