import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('scene - Signin', () => {
  const translator = str => str;
  const noop = () => {};

  it('render', () => {
    const comp = shallow(
      <Presenter __={translator} onSigninSuccess={noop} />
    );

    expect(comp.text()).toContain('SigninForm');
  });
});
