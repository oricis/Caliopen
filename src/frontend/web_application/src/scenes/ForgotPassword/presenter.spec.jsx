import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('scene - ResetPassword', () => {
  const translator = str => str;

  it('render', () => {
    const comp = shallow(
      <Presenter __={translator} location={{ search: '' }} />
    );

    expect(comp.text()).toContain('PasswordResetForm');
  });
});
