import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, select, boolean } from '@kadira/storybook-addon-knobs';
import DropdownMenu, { withDropdownControl } from '../../src/components/DropdownMenu';
import Button from '../../src/components/Button';
import { Code, ComponentWrapper } from '../presenters';

const DropdownControl = withDropdownControl(Button);

const Presenter = () => {
  const dropdownProps = {
    position: select('position', { '': '', bottom: 'bottom' }, ''),
    closeOnClick: boolean('closeOnClick', false),
  };

  return (
    <div>
      <ComponentWrapper size="tall" styles={{ textAlign: 'right' }}>
        <DropdownControl toggle="story-dropdown" className="float-right">
          {text('control children', 'Click me')}
        </DropdownControl>
        <DropdownMenu
          id="story-dropdown"
          {...dropdownProps}
        >{text('dropdown children', 'Hey hey I am a dropdown')}</DropdownMenu>
      </ComponentWrapper>
      <Code>
        {`
import DropdownMenu, { withDropdownControl } from './src/components/DropdownMenu';
import Button from './src/components/Button';

const DropdownControl = withDropdownControl(Button);

export default () => (
<DropdownControl
  toggle="story-dropdown"
  className="float-right"
>Click me</DropdownControl>
<DropdownMenu
  id="story-dropdown"
  position="bottom"
  closeOnClick
>Hey hey I am a dropdown</DropdownMenu>
);
        `}
      </Code>
    </div>
  );
};

export default Presenter;
