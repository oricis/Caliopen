import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Dropdown, { withDropdownControl } from '../../src/components/Dropdown';
import Button from '../../src/components/Button';
import { Code, ComponentWrapper } from '../presenters';

const DropdownControl = withDropdownControl(Button);

class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper inline>
          <DropdownControl
            toggle="story-dropdown"
            className="float-right"
          >Click me</DropdownControl>
          <Dropdown
            id="story-dropdown"
            position="bottom"
            closeOnClick
          >Hey hey I am a dropdown</Dropdown>
        </ComponentWrapper>
        <Code>
          {`
import Dropdown, { DropdownController } from './src/components/Dropdown';

<DropdownController
  toggle="story-dropdown"
  className="float-right"
>Click me</DropdownController>
<Dropdown
  {...this.state.props}
  id="story-dropdown"
  position="bottom"
  closeOnClick
>Hey hey I am a dropdown</Dropdown>
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
