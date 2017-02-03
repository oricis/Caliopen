import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Dropdown, { DropdownController } from '../../src/components/Dropdown';
import { Code, ComponentWrapper } from '../presenters';


class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper inline>
          <DropdownController
            toggle="story-dropdown"
            className="float-right"
          >Click me</DropdownController>
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
