import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
  i18nMark: () => whatever => whatever,
}));

describe('modules - tags - component WithUpdateEntityTags', () => {
  it('render', () => {
    const reduxProps = {
      i18n: { _: id => id },
      tags: [{ label: 'Foo', name: 'foo' }, { label: 'Bar', name: 'bar' }],
      updateTagCollection: jest.fn(() => 'foo'),
    };

    const message = { tags: [{ label: 'Foo', name: 'foo' }] };
    const tags = [{ label: 'Foo', name: 'foo' }, { label: 'Bar' }, { label: 'FooBar' }];

    return new Promise((resolve) => {
      const render = jest.fn(async (updateEntityTags) => {
        const result = await updateEntityTags('message', message, { tags });
        expect(result).toEqual('foo');
        expect(reduxProps.updateTagCollection).toHaveBeenCalledWith(reduxProps.i18n, reduxProps.tags, 'message', message, {
          tags,
        });

        resolve('done');
      });
      shallow(
        <Presenter render={render} {...reduxProps} />
      );
    });
  });
});
