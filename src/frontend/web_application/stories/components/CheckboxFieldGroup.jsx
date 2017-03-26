import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, boolean } from '@kadira/storybook-addon-knobs';
import { CheckboxFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    label: text('label', 'FooBar'),
    displaySwitch: boolean('displaySwitch', false),
    showTextLabel: boolean('showTextLabel (switch only)', false),
  };

  return (
    <div>
      <ComponentWrapper>
        <CheckboxFieldGroup {...props} />
      </ComponentWrapper>
      <Code>
        {`
import { SwitchFieldGroup } from './src/components/form';
export default () => (<SwitchFieldGroup />);

<SwitchFieldGroup label={label} display="switch" showTextLabel />

        `}
      </Code>
    </div>
  );
};

export default Presenter;
