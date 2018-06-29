import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('scene - Signin', () => {
  const props = {
    i18n: { t: str => str },
    onSignupSuccess: jest.fn(),
    settings: {},
  };

  it('render', () => {
    const comp = shallow(
      <Presenter {...props} />
    ).dive();

    expect(comp.text()).toContain('SignupForm');
  });
});
