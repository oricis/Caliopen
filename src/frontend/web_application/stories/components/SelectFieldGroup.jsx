import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { text, boolean, object } from '@kadira/storybook-addon-knobs';
import { SelectFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: '',
      props: {},
    };
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
    const handleInputChange = (event) => {
      this.setState({
        selectValue: event.target.value,
      });
    };

    const props = {
      label: text('label', 'Foobar'),
      showLabelforSr: boolean('showLabelforSr', false),
      options: object('options', [{ value: '', label: '' }, { value: 'foo', label: 'Foo' }, { value: 'bar', label: 'Bar' }]),
    }

    return (
      <div>
        <ComponentWrapper inline>
          <SelectFieldGroup
            name="my-text"
            value={this.state.selectValue}
            onChange={handleInputChange}
            {...props}
          />
        </ComponentWrapper>
        <Code>
          {`
import SelectFieldGroup from './src/components/SelectFieldGroup';

export default () => {
  this.state = { selectValue: '' };
  const handleInputChange = (event) => {
    this.setState({
      selectValue: event.target.value,
    });
  };

  return (
    <SelectFieldGroup
      label="Foobar"
      name="my-text"
      value={this.state.selectValue}
      options={[{ value: '', label: '' }, { value: 'foo', label: 'Foo' }, { value: 'bar', label: 'Bar' }]}
      onChange={handleInputChange}
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
