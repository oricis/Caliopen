import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { object } from '@kadira/storybook-addon-knobs';
import DefList from '../../src/components/DefList';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => (
  <div>
    <ComponentWrapper>
      <DefList
        definitions={object('definitions', [
          { title: 'Bar', descriptions: ['Bar description'] },
          { title: 'Foo', descriptions: ['Foo description'] },
        ])}
      />
    </ComponentWrapper>
    <Code>
      {`
import DefList from './src/components/DefList';

export default () => (
  <DefList
    descriptions={[
      { title: 'Bar', descriptions: ['Bar description'] },
      { title: 'Foo', descriptions: ['Foo description'] },
    ]}
  />
);
      `}
    </Code>
  </div>
  );

export default Presenter;
