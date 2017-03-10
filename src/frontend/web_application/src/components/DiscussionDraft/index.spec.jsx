import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './index';

describe('component DiscussionDraft', () => {
  it('render', () => {
    const comp = shallow(
      <Presenter>Foo</Presenter>
    );

    expect(comp.text()).toEqual('Foo');
  });
});
