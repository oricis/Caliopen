import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component WithTags', () => {
  it('render', () => {
    const reduxProps = {
      tags: [],
      isFetching: false,
      isInvalidated: false,
      requestTags: jest.fn(() => {
        reduxProps.tags = [{ label: 'Foo', name: 'foo' }, { label: 'Bar', name: 'bar' }, { label: 'FooBar', name: 'foobar' }];

        return Promise.resolve(reduxProps.tags);
      }),
    };

    const render = jest.fn();
    shallow(
      <Presenter render={render} {...reduxProps} />
    );
    expect(reduxProps.requestTags).toHaveBeenCalled();
    expect(render).toHaveBeenCalled();
  });
});
