import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component WithSearchTags', () => {
  it('render', () => {
    const reduxProps = {
      tags: [{ name: 'foobar', label: 'Foobar' }, { name: 'bar', label: 'Bar' }],
      isFetching: true,
    };

    return new Promise((resolve) => {
      const render = jest.fn(async (search, foundTags, isFetching) => {
        expect(isFetching).toEqual(reduxProps.isFetching);
        resolve(true);
      });
      shallow(
        <Presenter render={render} {...reduxProps} />
      );
      expect(render).toHaveBeenCalled();
    });
  });
});
