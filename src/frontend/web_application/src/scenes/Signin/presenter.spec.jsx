import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('../../modules/routing', () => ({
}));

describe('scene - Signin', () => {
  const props = {
    i18n: { _: id => id },
    initSettings: jest.fn(),
    location: { search: '' },
  };

  it('render', () => {
    const comp = shallow(
      <Presenter {...props} />
    ).dive();

    expect(comp.text()).toContain('SigninForm');
  });
});
