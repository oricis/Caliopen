import { queryStringify } from './QueryStringSerializer';

export const buildURL = (url, params) => {
  if (params) {
    const queryString = queryStringify(params);

    return url + (url.indexOf('?') === -1 ? '?' : '&') + queryString;
  }

  return url;
};
