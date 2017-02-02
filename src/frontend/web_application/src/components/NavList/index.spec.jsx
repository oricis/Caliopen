import React from 'react';
import { shallow } from 'enzyme';
import NavList, { ItemContent } from './';

describe('component NavList', () => {
  it('render', () => {
    const comp = shallow(
      <NavList>
        {[
          <ItemContent key="0">Foo</ItemContent>,
          <ItemContent key="1">Bar</ItemContent>,
        ]}
      </NavList>
    );

    expect(comp.find('ItemContent').length).toEqual(2);
    expect(comp.find('ItemContent').first().dive().text()).toEqual('Foo');
  });
});
