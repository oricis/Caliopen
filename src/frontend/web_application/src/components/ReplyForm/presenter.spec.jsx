import React from 'react';
import { shallow, mount } from 'enzyme';
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

  it('save and send', () => {
    const props = {
      __: str => str,
      onSave: jest.fn(),
      onSend: jest.fn(),
    };
    const comp = mount(
      <Presenter {...props} />
    );

    comp.find('button').at(0).simulate('click');
    expect(props.onSend).toHaveBeenCalled();
    comp.find('button').at(1).simulate('click');
    expect(props.onSave).toHaveBeenCalled();
  });
});
