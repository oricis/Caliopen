import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, select, boolean } from '@kadira/storybook-addon-knobs';
import { Fieldset, Legend, TextFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  render() {
    return (
      <div>
        <ComponentWrapper size="tall">
          <Fieldset>
            <Legend>{text('Legend label', 'Foobar')}</Legend>
            <TextFieldGroup label={text('TextFieldGroup label', 'Foo')} />
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
