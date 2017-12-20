import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './index';

describe('component DiscussionDraft', () => {
  it('render', () => {
    const props = {
      body: 'Foo',
      __: str => str,
      onChange: jest.fn(),
    };
    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('textarea').render().text()).toEqual('Foo');
  });
});
