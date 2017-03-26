import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { object } from '@kadira/storybook-addon-knobs';
import { RadioFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

const Presenter = () => {
  const props = {
    options: object('options', [{ value: 'foo', label: 'Foo' }, { value: 'bar', label: 'Bar' }]),
  };

  return (
    <div>
      <ComponentWrapper inline>
        <RadioFieldGroup
          value={''}
          onChange={action('onChange')}
          {...props}
        />
      </ComponentWrapper>
      <Code>
        {`
import RadioFieldGroup from './src/components/RadioFieldGroup';

export default () => {
const handleRadioChange = (event) => {
  this.setState({
    radioValue: event.target.value,
  });
};

return (
  <RadioFieldGroup
    name="my-radio"
    value={this.state.radioValue}
    options={[{ value: 'foo', label: 'Foo' }, { value: 'bar', label: 'Bar' }]}
    onChange={handleRadioChange}
  />
);
};
        `}
      </Code>
    </div>
  );
};

export default Presenter;
