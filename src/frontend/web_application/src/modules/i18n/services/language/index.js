export const DEFAULT_LANGUAGE = 'en';
export const AVAILABLE_LANGUAGES = ['en', 'fr', 'de'];

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
