import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Brand from '../../src/components/Brand';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {},
      brandTheme: '',
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
        brandTheme: event.target.value,
      });
    };

    return (
      <div>
        <ComponentWrapper>
          <Brand theme={this.state.brandTheme} />
        </ComponentWrapper>
        <ul>
          <li>
            <label htmlFor="brandTheme">Brand theme</label>
            <select name="brandTheme" onChange={handleInputChange}>
              <option value="">Default</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </li>
        </ul>
        <Code>
          {`
import Brand from './src/components/Brand';
export default () => (<Brand />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
