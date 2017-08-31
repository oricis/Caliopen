import React from 'react';
import { shallow } from 'enzyme';
import ImForm from './';

describe('component ImForm', () => {
  it('init form', () => {
    const props = {
      onSubmit: jest.fn(),
      __: str => str,
    };

    const comp = shallow(
      <ImForm {...props} />
    );

    expect(comp.find('Button').prop('type')).toEqual('submit');
  });
});
