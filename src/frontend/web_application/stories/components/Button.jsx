import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, boolean } from '@kadira/storybook-addon-knobs';
import Button from '../../src/components/Button';
import { Code, ComponentWrapper } from '../presenters';

const Buttons = () => {
  const props = {
    plain: boolean('plain', false),
    expanded: boolean('expanded', false),
    hollow: boolean('hollow', false),
    active: boolean('active', false),
    alert: boolean('alert', false),
    success: boolean('success', false),
    secondary: boolean('secondary', false),
    inline: boolean('inline', false),
    children: text('children', 'Click Me'),
  };

  return (
    <div>
      <ComponentWrapper>
        <Button {...props} onClick={action('clicked')} />
      </ComponentWrapper>
      <Code>
        {`
import Button from './src/components/Button';
export default () => (<Button plain expanded hollow active alert />);
        `}
      </Code>
    </div>
  );
};

export default Buttons;
