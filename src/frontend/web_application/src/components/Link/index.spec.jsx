import React from 'react';
import { shallow } from 'enzyme';
import Link from './';

describe('component Link', () => {
  it('render', () => {
    const comp = shallow(
      <Link>Foo</Link>
    );

    expect(comp.dive().text()).toEqual('Foo');
  });
});
