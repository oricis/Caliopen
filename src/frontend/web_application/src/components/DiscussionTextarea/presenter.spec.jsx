import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component DiscussionTextarea', () => {
  it('render', () => {
    const props = {
      body: 'Foo',
      i18n: { _: id => id },
      onChange: jest.fn(),
    };

    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('textarea').render().text()).toEqual('Foo');
  });
});
