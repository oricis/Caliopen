import React from 'react';

jest.mock('@lingui/react', () => ({
  withI18n: () => WrappedComponent => props =>
    (<WrappedComponent i18n={{ _: (id, values, { defaults }) => (defaults || id) }} {...props} />),
  i18nMark: str => str,
  Trans: ({ id, children }) => children || id,
  NumberFormat: ({ value }) => value,
}));

jest.mock('@lingui/macro', () => ({
  Trans: ({ id, children }) => {
    console.log('trans');

    return children || id;
  },
}));
