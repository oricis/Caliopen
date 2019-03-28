import React from 'react';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import promiseMiddleware from '../../../../store/middlewares/promise-middleware';
import thunkMiddleware from '../../../../store/middlewares/thunk-middleware';
import Presenter from './presenter';

const mockStore = configureMockStore([promiseMiddleware, thunkMiddleware]);

describe('component Device VerifyDevice', () => {
  const store = mockStore({});
  it('render', () => {
    const props = {
      store,
      device: {},
      onDeleteDevice: jest.fn(),
      onVerifyDevice: jest.fn(),
    };

    const comp = mount(<Presenter {...props} />);

    expect(comp.find('Button').length).toEqual(1);
  });
});
