import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, boolean } from '@kadira/storybook-addon-knobs';
import Badge from '../../src/components/Badge';
import { Code, ComponentWrapper } from '../presenters';

const Badges = () => {
  const props = {
    low: boolean('low', false),
    large: boolean('large', false),
    children: text('children', '142'),
  };

  return (
    <div>
      <ComponentWrapper>
        <Badge {...props} />
      </ComponentWrapper>
      <Code>
        {`
import Badge from './src/components/Badge';

export default () => (<Badge low large>142</Badge>);
        `}
      </Code>
    </div>
  );
};

export default Badges;
