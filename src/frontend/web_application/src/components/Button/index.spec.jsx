import React from 'react';
import { shallow } from 'enzyme';
import Button from './';

describe('component Button', () => {
  it('render', () => {
    const handleClick = jasmine.createSpy('handleClick');

    const comp = shallow(
      <Button onClick={handleClick}>Foo</Button>
    );

    expect(comp.dive().text()).toEqual('Foo');
    comp.simulate('click');
    expect(handleClick).toHaveBeenCalled();
  });
});
