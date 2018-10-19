import React from 'react';

jest.mock('@lingui/react', () => ({
  withI18n: () => WrappedComponent => props =>
    (<WrappedComponent i18n={{ _: (id, { defaults }) => (defaults || id) }} {...props} />),
  i18nMark: str => str,
  Trans: ({ id, children }) => children || id,
  NumberFormat: ({ value }) => value,
}));
