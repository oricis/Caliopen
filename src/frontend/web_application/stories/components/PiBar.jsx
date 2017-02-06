import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import PiBar from '../../src/components/PiBar/presenter';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        level: 50,
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
          <PiBar level={this.state.props.level} __={noop} />
        </ComponentWrapper>
        <ul>
          <li>
            <label>Level: {this.state.props.level}</label>
            {' '}
            <input
              type="range" min="0" max="100" step="1"
              name="level"
              onChange={this.handleInputChange}
              value={this.state.props.level}
            />
          </li>
        </ul>
        <Code>
          {`
import PiBar from './src/components/PiBar';

// level is a number between 0 & 100 usually
export default () => (<PiBar level={ level } />);
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
