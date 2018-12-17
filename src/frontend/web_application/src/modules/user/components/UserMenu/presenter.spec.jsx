import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('../../../../modules/settings', () => ({
  WithSettings: ({ render }) => render({}, false),
}));
jest.mock('../../../../components/PageTitle', () => () => null);

describe('component UserMenu', () => {
  it('render', () => {
    const props = {
      getUser: () => {},
    };
    const comp = shallow(<Presenter {...props} />);

    expect(comp.find('VerticalMenu').length).toEqual(1);
  });
});
