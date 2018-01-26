import React from 'react';
import { shallow } from 'enzyme';
import TextareaFieldGroup from './';

describe('component TextareaFieldGroup', () => {
  it('should render', () => {
    const props = {
      label: 'Foo',
      onChange: jest.fn(),
    };

    const comp = shallow(
      <TextareaFieldGroup {...props} />
    );

    expect(comp.find('label').text()).toEqual('Foo');
    comp.find('textarea').simulate('change');
    expect(props.onChange).toHaveBeenCalled();
  });
});
