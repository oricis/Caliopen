import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, boolean } from '@kadira/storybook-addon-knobs';
import Section from '../../src/components/Section';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    title: text('title', 'Title'),
    descr: text('descr', 'Description'),
    hasSeparator: boolean('hasSeparator', false),
  };

  return (
    <div>
      <ComponentWrapper>
        <Section {...props}>{text('section children', 'Foobar')}</Section> </ComponentWrapper>
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
