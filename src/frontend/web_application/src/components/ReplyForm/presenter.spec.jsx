import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component DiscussionDraft', () => {
  it('render', () => {
    const props = {
      __: str => str,
      onSave: jest.fn(),
      onSend: jest.fn(),
    };
    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('TopRow').length).toEqual(1);
    expect(comp.find('BodyRow').length).toEqual(1);
  });
});
