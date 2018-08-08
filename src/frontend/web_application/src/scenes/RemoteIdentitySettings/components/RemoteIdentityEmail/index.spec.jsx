import React from 'react';
import { shallow } from 'enzyme';
import RemoteIdentityEmail from './';

describe('component RemoteIdentityEmail', () => {
  it('init form', () => {
    const props = {
      remoteIdentity: {},
      onChange: jest.fn(),
      onDelete: jest.fn(),
      onCancel: jest.fn(),
    };

    const wrapper = shallow(<RemoteIdentityEmail {...props} />).dive();
    expect(wrapper.state().phase).toEqual(1);
  });

  it('existing remoteIdentity', () => {
    const props = {
      remoteIdentity: {
        identity_id: 'foo',
        display_name: 'Foo',
        infos: {},
      },
      onChange: jest.fn(),
      onDelete: jest.fn(),
      onCancel: jest.fn(),
    };

    const wrapper = shallow(<RemoteIdentityEmail {...props} />).dive();
    expect(wrapper.state().phase).toEqual(0);
  });
});
