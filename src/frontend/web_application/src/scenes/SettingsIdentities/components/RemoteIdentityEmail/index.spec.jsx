import React from 'react';
import { shallow } from 'enzyme';
import RemoteIdentityEmail from './';

describe('component RemoteIdentityEmail', () => {
  it('init form', () => {
    const props = {
      remoteIdentity: {},
      onConnect: jest.fn(),
      onDisconnect: jest.fn(),
      i18n: { t: strs => strs[0] },
    };

    const comp = shallow(
      <RemoteIdentityEmail {...props} />
    );

    expect(comp.state().phase).toEqual(1);
  });
});
