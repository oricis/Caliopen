import { setLocale, REQUEST_LOCALE } from '../modules/i18n';
import { getLocaleAsync } from '../../services/i18n';

export default store => next => (action) => {
  if (action.type === REQUEST_LOCALE) {
    getLocaleAsync().then(locale => store.dispatch(setLocale({ locale })));
  }

  const result = next(action);


  return result;
};
