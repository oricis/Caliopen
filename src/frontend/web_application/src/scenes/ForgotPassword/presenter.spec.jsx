import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
}));

describe('scene - ForgotPassword', () => {
  const translator = { t: str => str };

  it('render', () => {
    const comp = shallow(
      <Presenter i18n={translator} />
    );

    expect(comp.text()).toContain('ForgotPasswordForm');
  });
});
