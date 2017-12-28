import React from 'react';
import { shallow } from 'enzyme';
import EmailForm from './';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
}));

describe('component EmailForm', () => {
  it('init form', () => {
    const props = {
      i18n: { _: id => id },
    };

    const comp = shallow(
      <EmailForm {...props} />
    );

    expect(comp.text()).toEqual('<FormGrid />');
  });
});
