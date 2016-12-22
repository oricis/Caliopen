import React from 'react';
import { shallow } from 'enzyme';
import TextList, { ItemContent } from './';

describe('component TextList', () => {
  it('render', () => {
    const comp = shallow(
      <TextList>
        {[
          <ItemContent key="0">Foo</ItemContent>,
          <ItemContent key="1">Bar</ItemContent>,
        ]}
      </TextList>
    );

    expect(comp.find('ItemContent').length).toEqual(2);
    expect(comp.find('ItemContent').first().dive().text()).toEqual('Foo');
  });
});
