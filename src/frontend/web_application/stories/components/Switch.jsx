import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { Switch } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper size="tall">
          <Switch label="Foobar (displayed for SR)" duplicateLabel />
        </ComponentWrapper>
        <Code>
          {`
import { Switch } from './src/components/form';
export default () => (
  <Switch label="Foobar (displayed for SR)" duplicateLabel />
);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
