import { DEFAULT_LANGUAGE } from './getLanguage';

export const getUserLocales = () => {
  if (BUILD_TARGET === 'browser') {
    const languages = window.navigator.languages || [];

    return [
      ...languages,
      ...(window.navigator.language || window.navigator.userLanguage || DEFAULT_LANGUAGE),
    ];
  }

  if (BUILD_TARGET === 'server' && global.USER_LOCALE) {
    return [global.USER_LOCALE];
  }

  // if (BUILD_TARGET === 'electron') {
  //   // eslint-disable-next-line
  //   const { ipcRenderer } = require('electron');
  //
  //   return [ipcRenderer.sendSync('getLocale')];
  // }

  return [];
};
