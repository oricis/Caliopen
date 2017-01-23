import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import DevicesManagment from '../../src/scenes/Settings';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper>
          <DevicesManagment />
        </ComponentWrapper>
        <Code>
          {`
            `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
