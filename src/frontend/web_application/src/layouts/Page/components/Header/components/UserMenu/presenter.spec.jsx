import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component UserMenu', () => {
  const translate = str => str;

  it('render', () => {
    const comp = shallow(
      <Presenter __={translate} />
    );

    expect(comp.find('VerticalMenu').length).toEqual(1);
  });
});
