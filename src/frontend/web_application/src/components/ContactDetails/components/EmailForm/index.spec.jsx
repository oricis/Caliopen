import React from 'react';
import { shallow } from 'enzyme';
import EmailForm from './';

describe('component EmailForm', () => {
  it('init form', () => {
    const props = {
      onSubmit: jest.fn(),
      __: str => str,
    };

    const comp = shallow(
      <EmailForm {...props} />
    );

    expect(comp.find('Button').prop('type')).toEqual('submit');
  });
});
