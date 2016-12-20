import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Badge from '../../src/components/Badge';
import { Code, ComponentWrapper } from '../presenters';

class Badges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        low: false,
        large: false,
      },
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
          <Badge {...this.state.props}>142</Badge>
        </ComponentWrapper>
        <Code>
          {`
import Badge from './src/components/Badge';

export default () => (<Badge low large>142</Badge>);
          `}
        </Code>
        <ul>
          <li><label><input type="checkbox" name="low" checked={this.state.props.low} onChange={this.handlePropsChanges} />Low</label></li>
          <li><label><input type="checkbox" name="large" checked={this.state.props.large} onChange={this.handlePropsChanges} />Large</label></li>
        </ul>
      </div>
    );
  }
}

export default Badges;
