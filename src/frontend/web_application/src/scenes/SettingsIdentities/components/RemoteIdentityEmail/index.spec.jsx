import React from 'react';
import { shallow } from 'enzyme';
import RemoteIdentityEmail from './';

describe('component RemoteIdentityEmail', () => {
  it('init form', () => {
    const props = {
      remoteIdentity: {},
      onConnect: jest.fn(),
      onDisconnect: jest.fn(),
      __: str => str,
    };

    const comp = shallow(
      <RemoteIdentityEmail {...props} />
    );

    expect(comp.state().phase).toEqual(1);
  });
});
