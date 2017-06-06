import React from 'react';
import { shallow } from 'enzyme';
import RecipientList from './presenter';

describe('component RecipientList', () => {
  it('render', () => {
    const noop = str => str;
    const comp = shallow(
      <RecipientList __={noop} />
    );
    const inst = comp.instance();

    expect(inst.addParticipant).toBeInstanceOf(Function);
  });
});
