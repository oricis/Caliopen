import React from 'react';
import { shallow } from 'enzyme';
import TextareaFieldGroup from './';

describe('component TextareaFieldGroup', () => {
  it('render', () => {
    const props = {
      label: 'Foo',
      onChange: jasmine.createSpy('onChange'),
    };

    const comp = shallow(
      <TextareaFieldGroup {...props} />
    );

    expect(comp.find('label').text()).toEqual('Foo');
    comp.find('textarea').simulate('change');
    expect(props.onChange).toHaveBeenCalled();
  });
});
