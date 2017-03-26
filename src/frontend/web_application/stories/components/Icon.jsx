import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { select, boolean } from '@kadira/storybook-addon-knobs';
import Icon, { typeAssoc } from '../../src/components/Icon';
import { Code, ComponentWrapper } from '../presenters';


const Presenter = () => {
  const props = {
    type: select('type', typeAssoc),
    spaced: boolean('spaced', true),
  };

  return (
    <div>
      <ComponentWrapper inline>
        <Icon {...props} />
      </ComponentWrapper>
      <Code>
        {`
import Icon from './src/components/Icon';

export default () => (<Icon type="edit" spaced />);
        `}
      </Code>
    </div>
  );
};

export default Presenter;
