import React from 'react';
import { shallow } from 'enzyme';
import PhoneForm from './';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
}));

describe('component PhoneForm', () => {
  it('init form', () => {
    const props = {
      i18n: { t: strs => strs[0] },
    };

    const comp = shallow(
      <PhoneForm {...props} />
    );

    expect(comp.text()).toEqual('<FormGrid />');
  });
});
