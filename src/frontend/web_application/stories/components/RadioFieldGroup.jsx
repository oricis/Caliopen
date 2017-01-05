import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { RadioFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handlePropsChanges = this.handlePropsChanges.bind(this);
  }

  handlePropsChanges(event) {
    const { name, checked } = event.target;

    this.setState(prevState => ({
      props: {
        ...prevState.props,
        [name]: checked,
      },
    }));
  }

  render() {
    const handleRadioChange = (event) => {
      this.setState({
        radioValue: event.target.value,
      });
    };

    return (
      <div>
        <ComponentWrapper inline>
          <RadioFieldGroup
            name="my-radio"
            value={this.state.radioValue}
            options={[{ value: 'foo', label: 'Foo' }, { value: 'bar', label: 'Bar' }]}
            onChange={handleRadioChange}
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
  }
}

export default Presenter;
