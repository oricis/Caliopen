import React from 'react';
import { shallow } from 'enzyme';
import BlockList, { ItemContent } from './';

describe('component BlockList', () => {
  it('render', () => {
    const comp = shallow(
      <BlockList>
        {[
          <ItemContent key="0">Foo</ItemContent>,
          <ItemContent key="1">Bar</ItemContent>,
        ]}
      </BlockList>
    );

    expect(comp.find('ItemContent').length).toEqual(2);
    expect(comp.find('ItemContent').first().dive().text()).toEqual('Foo');
  });
});
