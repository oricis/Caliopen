import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
}));

describe('scene - Signin', () => {
  const i18n = { t: strs => strs[0] };

  it('render', () => {
    const comp = shallow(
      <Presenter i18n={i18n} location={{ search: '' }} />
    );

    expect(comp.text()).toContain('SigninForm');
  });
});
