import React from 'react';
import { shallow } from 'enzyme';
import TagsForm from './presenter';

jest.mock('lingui-react', () => ({
  withI18n: () => Component => (...props) => <Component {...props} i18n={{ _: id => id }} />,
  i18nMark: whatever => whatever,
}));

describe('component TagsForm', () => {
  const connectedProps = {
    i18n: { _: id => id },
  };

  it('render', () => {
    const noop = str => str;
    const comp = shallow(
      <TagsForm search={noop} updateTags={noop} {...connectedProps} />
    );

    expect(comp.find('DropdownMenu').length).toEqual(1);
  });
});
