import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { PasswordStrength } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {},
      passwordStrength: 'strong',
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
        passwordStrength: event.target.value,
      });
    };

    return (
      <div>
        <ComponentWrapper>
          <PasswordStrength strength={this.state.passwordStrength} />
        </ComponentWrapper>
        <ul>
          <li>
            <label>Password Strength</label>
            <select name="passwordStrength" onChange={handleInputChange}>
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="weak">Weak</option>
            </select>
          </li>
        </ul>
        <Code>
          {`
import PasswordStrength from './src/components/PasswordStrength';
export default () => (<PasswordStrength strength={ strength } />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
