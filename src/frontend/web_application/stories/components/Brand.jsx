import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Brand from '../../src/components/Brand';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {},
    };
  }

  render() {
    return (
      <div>
        <ComponentWrapper>
          <Brand />
        </ComponentWrapper>

        <Code>
          {`
import Brand from './src/components/Brand';
export default () => (<Brand />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
