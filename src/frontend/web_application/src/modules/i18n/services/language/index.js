import { DEFAULT_LANGUAGE, AVAILABLE_LANGUAGES } from '../../';

export const getLanguage = (locales = []) => {
  const language = locales.reduce((acc, locale) => {
    if (acc) {
      return acc;
    }
    if (AVAILABLE_LANGUAGES.indexOf(locale) !== -1) {
      return locale;
    }

    const lang = AVAILABLE_LANGUAGES.find(availableLang => locale.startsWith(availableLang));

    if (lang) {
      return lang;
    }

    return acc;
  }, undefined);

  return language || DEFAULT_LANGUAGE;
};
