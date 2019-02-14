import React from 'react';
import { shallow, mount } from 'enzyme';
import Dropdown, { withDropdownControl, CONTROL_PREFIX } from './';
import { Button } from '../';

const DropdownControl = withDropdownControl(Button);

describe('component DropdownControl > id', () => {
  it('render', () => {
    const comp = shallow(
      <DropdownControl toggleId="foo">bar</DropdownControl>
    );

    expect(comp.matchesElement(<Button id={`${CONTROL_PREFIX}-foo`}>bar</Button>)).toEqual(true);
  });
});


describe('component Dropdown', () => {
  it('should be open', () => {
    // when prop 'show' is true, dropdown should be open
    const comp = mount(
      <Dropdown id="foo" show>bar</Dropdown>
    );

    expect(comp.state().isOpen).toEqual(true);
  });

  it('should have no offset', () => {
    // when dropdown is open and there's no dropdownControl,
    // offset should always be null
    const comp = mount(
      <Dropdown id="foo" show>bar</Dropdown>
    );

    expect(comp.state().dropdownStyle.top).toEqual(undefined);
    expect(comp.state().dropdownStyle.left).toEqual(undefined);
  });
});
