import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import DefList from '../../src/components/DefList';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => (
  <div>
    <ComponentWrapper>
      <DefList>{[
        { title: 'Bar', descriptions: ['Bar description'] },
        { title: 'Foo', descriptions: ['Foo description'] },
      ]}
      </DefList>
    </ComponentWrapper>
    <Code>
      {`
import DefList from './src/components/DefList';

export default () => (
<DefList>{[
{ title: 'Foo', descriptions: ['Foo description'] },
{ title: 'Bar', descriptions: ['Bar description'] },
]}</DefList>);
      `}
    </Code>
  </div>
  );

export default Presenter;
