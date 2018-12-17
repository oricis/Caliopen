import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('../../modules/routing', () => ({
  withPush: () => C => props => <C {...props} />,
}));

describe('scene - Signup', () => {
  const props = {
    i18n: { _: str => str },
    onSignupSuccess: jest.fn(),
    settings: {},
    push: () => {},
  };

  it('render', () => {
    const comp = shallow(<Presenter {...props} />).dive().dive();

    expect(comp.text()).toContain('SignupForm');
  });
});
