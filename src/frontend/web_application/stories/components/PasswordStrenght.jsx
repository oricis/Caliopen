import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import { PasswordStrenght } from '../../src/components/form';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {},
      passwordStrenght: 'strong',
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
        passwordStrenght: event.target.value,
      });
    };

    return (
      <div>
        <ComponentWrapper>
          <PasswordStrenght strenght={this.state.passwordStrenght} />
        </ComponentWrapper>
        <ul>
          <li>
            <label>Password Strenght</label>
            <select name="passwordStrenght" onChange={handleInputChange}>
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="weak">Weak</option>
            </select>
          </li>
        </ul>
        <Code>
          {`
import PasswordStrenght from './src/components/PasswordStrenght';
export default () => (<PasswordStrenght strenght={ strenght } />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
