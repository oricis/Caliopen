import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, boolean } from '@kadira/storybook-addon-knobs';
import Title from '../../src/components/Title';
import Button from '../../src/components/Button';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    hr: boolean('hr', false),
    actions: (<span className="pull-right">{text('actions', 'Foo')}</span>),
  };

  return (
    <div>
      <ComponentWrapper>
        <Title {...props}>{text('Title children', 'Hello world')}</Title>
      </ComponentWrapper>
      <Code>
        {`
import Title from './src/components/Title';

export default () => (<Title hr actions={(<a href className="pull-right">Foo</a>)}>Hello world</Title>);
        `}
      </Code>
    </div>
  );
};

export default Presenter;
