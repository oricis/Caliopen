import React from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { number } from '@kadira/storybook-addon-knobs';  // eslint-disable-line
import { object } from '@kadira/storybook-addon-knobs';  // eslint-disable-line
import MultidimensionalPi from '../../src/components/MultidimensionalPi';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    piMax: number('piMax', 100),
    pi: object('points', [
      { name: 'behavioral', level: 50 },
      { name: 'contextual', level: 50 },
      { name: 'technical', level: 50 },
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

// piMax: max value for Pi level (number)
// pi: [
//  { name: 'behavioral', level: 50 },
//  { name: 'contextual', level: 50 },
//  { name: 'technical', level: 50 },
]
export default () => (<MultidimensionalPi piMax={ piMax } pi={ points } />);
        `}
      </Code>
    </div>
  );
};

export default Presenter;
