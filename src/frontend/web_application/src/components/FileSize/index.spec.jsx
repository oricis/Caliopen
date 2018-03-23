import React from 'react';
import { shallow } from 'enzyme';
import FileSize from './';

describe('component FileSize', () => {
  it('render mb', () => {
    const comp = shallow(
      <FileSize size={10000000} />
    );

    expect(comp.render().text()).toEqual('file.size.mB');
  });

  it('render kb', () => {
    const comp = shallow(
      <FileSize size={10000} />
    );

    expect(comp.render().text()).toEqual('file.size.kB');
  });
});
