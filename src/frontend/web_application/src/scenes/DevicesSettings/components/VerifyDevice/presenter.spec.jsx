import React from 'react';
import { mount } from 'enzyme';
import Presenter from './presenter';

describe('component Device VerifyDevice', () => {
  it('render', () => {
    const props = {
      device: {},
      onDeleteDevice: jest.fn(),
      onVerifyDevice: jest.fn(),
    };

    const comp = mount(
      <Presenter {...props} />
    );

    expect(comp.find('Button').length).toEqual(2);
  });
});
