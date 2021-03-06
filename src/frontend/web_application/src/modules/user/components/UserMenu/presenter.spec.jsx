import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('../../../../modules/settings', () => ({
  WithSettings: ({ render }) => render({}, false),
}));
jest.mock('../../../../modules/userNotify', () => ({
  withNotification: () => (C) => C,
}));
jest.mock('../../../../components/PageTitle', () => () => null);
jest.mock('../../../../modules/userNotify/hoc/withNotification', () => ({
  withNotification: () => (noop) => noop,
}));

describe('component UserMenu', () => {
  it('render', () => {
    const props = {
      getUser: () => {},
      notifyInfo: () => {},
    };
    const comp = shallow(<Presenter {...props} />);
    expect(comp.dive().find('VerticalMenu').length).toEqual(1);
  });
});
