import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Section from '../../src/components/Section';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const noop = str => str;

  return (
    <div>
      <ComponentWrapper>
        <Section
          title="section.title"
          descr="section.descr"
          __={noop}
        />
      </ComponentWrapper>
      <Code>
        {`
import Section from './src/components/Section';
// title and descr are optional
export default () => (<Section title={ title } descr={ descr } />);
        `}
      </Code>
    </div>
  );
};


export default Presenter;
