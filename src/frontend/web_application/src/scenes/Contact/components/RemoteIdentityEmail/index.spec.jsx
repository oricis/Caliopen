import React from 'react';
import { shallow } from 'enzyme';
import RemoteIdentityEmail from './';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
}));

describe('component RemoteIdentityEmail', () => {
  it('init form', () => {
    const props = {
      remoteIdentity: {},
      onConnect: jest.fn(),
      onDisconnect: jest.fn(),
      i18n: { _: id => id },
    };

    const comp = shallow(
      <RemoteIdentityEmail {...props} />
    );

    expect(comp.state().phase).toEqual(1);
  });
});
