import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Settings from '../../src/layouts/Settings/presenter';
import Devices from '../../src/scenes/Devices/presenter';

import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        hr: false,
      },
    };
  }

  render() {
    const noop = str => str;

    return (
      <div>
        <ComponentWrapper>
          <Settings>
            <Devices __={noop} />
          </Settings>
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
