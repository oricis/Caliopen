import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import PasswordStrength from '../../src/components/form/PasswordStrength/presenter';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        passwordStrength: 0,
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;

    this.setState(prevState => ({
      props: {
        ...prevState.props,
        [name]: value,
      },
    }));
  }

  render() {
    const noop = str => str;

    return (
      <div>
        <ComponentWrapper>
          <PasswordStrength strength={this.state.props.passwordStrength} __={noop} />
        </ComponentWrapper>
        <ul>
          <li>
            <label>Password Strength: {this.state.props.passwordStrength}</label>
            {' '}
            <input
              type="range" min="0" max="4" step="1" name="passwordStrength"
              onChange={this.handleInputChange}
              value={this.state.props.passwordStrength}
            />
          </li>
        </ul>
        <Code>
          {`
import PasswordStrength from './src/components/PasswordStrength';

// strength is a number between 0 & 4 usually, the score of https://github.com/dropbox/zxcvbn
export default () => (<PasswordStrength strength={ strength } />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
