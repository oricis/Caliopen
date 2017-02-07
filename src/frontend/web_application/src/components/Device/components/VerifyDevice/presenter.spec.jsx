import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component Device VerifyDevice', () => {
  it('render', () => {
    const props = {
      device: {},
      onDelete: jest.fn(),
      onVerify: jest.fn(),
      __: str => str,
    };

    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('Button').prop('type')).toEqual('submit');
  });
});
