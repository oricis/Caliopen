import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import TagsForm from '../../src/components/TagsForm/presenter';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const noop = str => str;

  return (
    <div>
      <ComponentWrapper>
        <TagsForm

          __={noop}
        />
      </ComponentWrapper>
      <Code>
        {`
import TagsForm from './src/components/TagsForm';
export default () => (<TagsForm  />);
        `}
      </Code>
    </div>
  );
};


export default Presenter;
