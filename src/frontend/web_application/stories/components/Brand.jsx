import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { select } from '@kadira/storybook-addon-knobs';
import Brand from '../../src/components/Brand';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    theme: select('theme', { '': '', low: 'low', high: 'high' }, ''),
  };

  return (
    <div>
      <ComponentWrapper size="tall">
        <Brand {...props} />
      </ComponentWrapper>
      <Code>
        {`
import Brand from './src/components/Brand';
export default () => (<Brand />);
        `}
      </Code>
    </div>
  );
};

export default Presenter;
