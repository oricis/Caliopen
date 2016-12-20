import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Link from '../../src/components/Link';
import { Code, ComponentWrapper } from '../presenters';

class Links extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        noDecoration: false,
        button: false,
        expanded: false,
        active: false,
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
          <Link {...this.state.props}>Click Me</Link>
        </ComponentWrapper>
        <Code>
          {'<Link noDecoration button expanded active />'}
        </Code>
        <ul>
          <li><label><input type="checkbox" onChange={this.handlePropsChanges} name="noDecoration" checked={this.state.props.noDecoration} />No decorations</label></li>
          <li><label><input type="checkbox" onChange={this.handlePropsChanges} name="button" checked={this.state.props.button} />Button</label></li>
          <li><label><input type="checkbox" onChange={this.handlePropsChanges} name="expanded" checked={this.state.props.expanded} />Expanded</label></li>
          <li><label><input type="checkbox" onChange={this.handlePropsChanges} name="active" checked={this.state.props.active} />Active</label></li>
        </ul>
      </div>
    );
  }
}

export default Links;
