import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { Fieldset, Legend, TextFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper tall>
          <Fieldset>
            <Legend>Foobar</Legend>
            <TextFieldGroup label="Foo" />
          </Fieldset>
        </ComponentWrapper>
        <Code>
          {`
import { Fieldset, Legend, TextFieldGroup } from './src/components/form';

export default () => (
  <Fieldset>
    <Legend>Foobar</Legend>
    <TextFieldGroup label="Foo" />
  </Fieldset>
);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
