import React from 'react';
import { shallow } from 'enzyme';
import TagItem from './';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
  i18nMark: whatever => whatever,
}));

describe('component TagItem', () => {
  const connectedProps = {
    i18n: { _: id => id },
  };

  it('render', () => {
    const props = {
      tag: { name: 'foo', label: 'Foo', type: 'user' },
      onDelete: whatever => whatever,
    };

    const comp = shallow(<TagItem {...props} {...connectedProps} />);

    expect(comp.render().find('.m-tag__text').text()).toEqual('Foo');
  });
});
