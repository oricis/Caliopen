import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { CheckboxFieldGroup } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {},
      displaySwitch: false,
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
        displaySwitch: event.target.value,
      });
    };

    return (
      <div>
        <ComponentWrapper>
          <CheckboxFieldGroup label="FooBar" displaySwitch={this.state.displaySwitch} {...this.state.props} />
        </ComponentWrapper>
        <ul>
          <li>
            <label htmlFor="displaySwitch">display</label>
            <select name="displaySwitch" onChange={handleInputChange}>
              <option value="">Default</option>
              <option value="true">Switch</option>
            </select>
          </li>
          {this.state.displaySwitch &&
          <li><label htmlFor="showTextLabel"><input type="checkbox" name="showTextLabel" checked={this.state.props.showTextLabel} onChange={this.handlePropsChanges} /> Show Label</label></li>
          }
        </ul>
        <Code>
          {`
import { SwitchFieldGroup } from './src/components/form';
export default () => (<SwitchFieldGroup />);

<SwitchFieldGroup label={label} display="switch" showTextLabel />

          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
