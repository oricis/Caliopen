import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import promiseMiddleware from '../../../../store/middlewares/promise-middleware';
import thunkMiddleware from '../../../../store/middlewares/thunk-middleware';
import Presenter from './presenter';

jest.mock('../../../../modules/settings', () => ({
  WithSettings: ({ render }) => render({}, false),
}));
jest.mock('../../../../modules/userNotify', () => ({
  withNotification: () => C => C,
}));
jest.mock('../../../../components/PageTitle', () => () => null);

describe('component UserMenu', () => {
  const mockStore = configureMockStore([promiseMiddleware, thunkMiddleware]);
  const store = mockStore({});

  it('render', () => {
    const props = {
      getUser: () => {},
    };
    const comp = shallow(<Presenter {...props} store={store} />);

    expect(comp.dive().dive().find('VerticalMenu').length).toEqual(1);
  });
});
