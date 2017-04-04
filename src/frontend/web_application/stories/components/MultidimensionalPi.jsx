import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { number } from '@kadira/storybook-addon-knobs';  // eslint-disable-line
import { object } from '@kadira/storybook-addon-knobs';  // eslint-disable-line
import MultidimensionalPi from '../../src/components/MultidimensionalPi';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    piMax: number('piMax', 100),
    points: object('points', [
      { name: 'behavioral', pi: 30 },
      { name: 'contextual', pi: 60 },
      { name: 'technical', pi: 55 },
    ]),
  };

  return (
    <div>
      <ComponentWrapper>
        <MultidimensionalPi {...props} />
      </ComponentWrapper>
      <Code>
        {`
import MultidimensionalPi from './src/components/MultidimensionalPi';

// level: number between 0 and 100
export default () => (<MultidimensionalPi level={ level } />);
        `}
      </Code>
    </div>
  );
};

export default Presenter;
