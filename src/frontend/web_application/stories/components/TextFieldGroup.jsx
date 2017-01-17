import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { TextFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        errors: [],
      },
    };
    this.handlePropsChanges = this.handlePropsChanges.bind(this);
    this.handleHasError = this.handleHasError.bind(this);
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

  handleHasError() {
    this.setState(prevState => ({
      hasError: !prevState.hasError,
      props: {
        ...prevState.props,
        errors: !prevState.hasError ? ['Error Label'] : undefined,
      },
    }));
  }

  render() {
    const handleInputChange = (event) => {
      this.setState({
        textValue: event.target.value,
      });
    };

    return (
      <div>
        <ComponentWrapper inline>
          <TextFieldGroup
            label="Foobar"
            name="my-text"
            showLabelforSr={this.state.showLabelforSr}
            value={this.state.textValue}
            onChange={handleInputChange}
            {...this.state.props}
          />
        </ComponentWrapper>
        <ul>
          <li><label><input type="checkbox" name="showLabelforSr" checked={this.state.props.showLabelforSr} onChange={this.handlePropsChanges} /> Show Label for SR</label></li>
          <li><label><input type="checkbox" name="error" checked={this.state.props.error} onChange={this.handleHasError} /> Show errors</label></li>
        </ul>
        <Code>
          {`
import TextFieldGroup from './src/components/TextFieldGroup';

export default () => {
  const handleRadioChange = (event) => {
    this.setState({
      textValue: event.target.value,
    });
  };

  return (
    <TextFieldGroup
      label="Foobar"
      name="my-text"
      value={this.state.textValue}
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
