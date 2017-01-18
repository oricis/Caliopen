import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { SwitchFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    return (
      <div>
        <ComponentWrapper>
          <SwitchFieldGroup label="FooBar" {...this.state.props} />
        </ComponentWrapper>
        <ul>
          <li><label htmlFor="showTextLabel"><input type="checkbox" name="showTextLabel" checked={this.state.props.showTextLabel} onChange={this.handlePropsChanges} /> Show Label</label></li>
        </ul>
        <Code>
          {`
import { SwitchFieldGroup } from './src/components/form';
export default () => (<SwitchFieldGroup />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
