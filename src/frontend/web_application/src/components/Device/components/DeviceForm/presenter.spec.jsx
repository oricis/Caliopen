import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component Device DeviceForm', () => {
  it('render', () => {
    const props = {
      device: {},
      onChange: () => {},
      __: str => str,
    };

    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('TextFieldGroup').length).toEqual(2);
    expect(comp.find('SelectFieldGroup').length).toEqual(1);
  });
});
