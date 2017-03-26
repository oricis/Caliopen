import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { boolean } from '@kadira/storybook-addon-knobs';
import Spinner from '../../src/components/Spinner';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    isLoading: boolean('isLoading', false),
  };

  return (
    <div>
      <ComponentWrapper>
        <Spinner {...props} />
      </ComponentWrapper>
      <Code>
        {`
import Spinner from './src/components/Spinner';

export default () => (<Spinner isLoading />);
        `}
      </Code>
    </div>
  );
};

export default Presenter;
