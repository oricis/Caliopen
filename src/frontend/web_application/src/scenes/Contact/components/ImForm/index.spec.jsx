import React from 'react';
import { shallow } from 'enzyme';
import ImForm from './';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
}));

describe('component ImForm', () => {
  it('init form', () => {
    const props = {
      i18n: { t: strs => strs[0] },
    };

    const comp = shallow(
      <ImForm {...props} />
    );

    expect(comp.text()).toEqual('<FormGrid />');
  });
});
