import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import DevicesManagement from '../../src/scenes/Settings';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper>
          <DevicesManagement />
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
