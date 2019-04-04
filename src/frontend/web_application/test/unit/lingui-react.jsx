import React from 'react';

jest.mock('@lingui/react', () => ({
  withI18n: () => WrappedComponent => props =>
    (<WrappedComponent i18n={{ _: (id, values, { defaults }) => (defaults || id) }} {...props} />),
  i18nMark: str => str,
  Trans: ({ id, children }) => {
    if (!children) {
      return id;
    }

    return <div>{children}</div>;
  },
  NumberFormat: ({ value }) => value,
}));

jest.mock('@lingui/macro', () => ({
  Trans: ({ id, children }) => {
    if (!children) {
      return id;
    }

    return <div>{children}</div>;
  },
}));
