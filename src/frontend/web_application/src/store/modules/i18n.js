export const REQUEST_LOCALE = 'co/i18n/REQUEST_LOCALE';
export const SET_LOCALE = 'co/i18n/SET_LOCALE';

export function requestLocale() {
  return {
    type: REQUEST_LOCALE,
    payload: {},
  };
}

export function setLocale({ locale }) {
  return {
    type: SET_LOCALE,
    payload: { locale },
  };
}

const initialState = {
  locale: 'en',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOCALE:
      return { ...state, locale: action.payload.locale };
    default:
      return state;
  }
}
