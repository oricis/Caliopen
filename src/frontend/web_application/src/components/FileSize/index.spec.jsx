import React from 'react';
import { shallow } from 'enzyme';
import FileSize from './';

describe('component FileSize', () => {
  it('render', () => {
    const comp = shallow(
      <FileSize size={10000000} />
    );

    expect(comp.render().text()).toEqual('10 mB');
  });
});
